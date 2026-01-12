'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { makeGqlClient } from '@/lib/graphql';
import { getOrCreateAnonSession, setAnonName } from '@/lib/anonSession';
import { getToken } from '@/lib/auth';
import Link from 'next/link';
import { subscribe } from '@/lib/graphqlWs';
import { clipUploadUrl, uploadBlob } from '@/lib/uploads';
import { useRouter } from 'next/navigation';

type Stream = {
  uuid: string;
  title: string;
  description: string;
  status: 'live' | 'processing' | 'past';
};

type ChatMessage = {
  uuid: string;
  create_date: string;
  anon_id: string;
  anon_text_color: string;
  anon_background_color: string;
  name?: string | null;
  message: string;
};

export default function LiveStreamPage() {
  const params = useParams<{ id: string }>();
  const uuid = params.id;
  const router = useRouter();

  const [stream, setStream] = useState<Stream | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatText, setChatText] = useState('');
  const [name, setName] = useState('');
  const [rtcError, setRtcError] = useState<string | null>(null);

  const isHost = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(`easystream:host:${uuid}`) === 'true';
  }, [uuid]);

  const peerId = useMemo(() => {
    return isHost ? `streamer-${uuid}` : `peer-${crypto.randomUUID()}`;
  }, [isHost, uuid]);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pcByPeerRef = useRef(new Map<string, RTCPeerConnection>());
  const recorderRef = useRef<MediaRecorder | null>(null);
  const clipBufferRef = useRef<{ blobs: Blob[]; bytes: number }>({ blobs: [], bytes: 0 });

  useEffect(() => {
    const client = makeGqlClient();
    client
      .request<{ stream: Stream }>(
        `query($uuid:String!){stream(uuid:$uuid){uuid title description status}}`,
        { uuid },
      )
      .then((r) => setStream(r.stream));

    client
      .request<{ chatMessages: ChatMessage[] }>(
        `query($streamUuid:String!){chatMessages(streamUuid:$streamUuid){uuid create_date anon_id anon_text_color anon_background_color name message}}`,
        { streamUuid: uuid },
      )
      .then((r) => setMessages(r.chatMessages));

    if (!isHost) {
      client.request(
        `mutation($uuid:String!,$peerId:String!){joinStream(uuid:$uuid,peerId:$peerId)}`,
        {
          uuid,
          peerId,
        },
      );
    }

    const disposeSignal = subscribe<{ signalReceived: any }>(
      {
        query: `
          subscription Signal($streamUuid: String!, $peerId: String!) {
            signalReceived(streamUuid: $streamUuid, peerId: $peerId) {
              streamUuid
              toPeerId
              fromPeerId
              payload
              createdAt
            }
          }
        `,
        variables: { streamUuid: uuid, peerId },
      },
      async (data) => {
        const msg = data.signalReceived as {
          fromPeerId: string;
          payload: string;
        };
        const payload = JSON.parse(msg.payload) as any;

        // Host receives offers/ice; Viewer receives answers/ice.
        if (payload.type === 'offer' && isHost) {
          const pc = getOrCreatePc(msg.fromPeerId, true);
          await pc.setRemoteDescription(payload.sdp);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          await client.request(
            `mutation($streamUuid:String!,$toPeerId:String!,$fromPeerId:String!,$payload:String!){sendSignal(streamUuid:$streamUuid,toPeerId:$toPeerId,fromPeerId:$fromPeerId,payload:$payload)}`,
            {
              streamUuid: uuid,
              toPeerId: msg.fromPeerId,
              fromPeerId: peerId,
              payload: JSON.stringify({ type: 'answer', sdp: pc.localDescription }),
            },
          );
        }

        if (payload.type === 'answer' && !isHost) {
          const pc = pcByPeerRef.current.get(msg.fromPeerId);
          if (pc) await pc.setRemoteDescription(payload.sdp);
        }

        if (payload.type === 'ice') {
          const pc = pcByPeerRef.current.get(msg.fromPeerId);
          if (pc && payload.candidate) {
            try {
              await pc.addIceCandidate(payload.candidate);
            } catch {
              // ignore race
            }
          }
        }
      },
    );

    const disposeChat = subscribe<{
      chatMessageAdded: { streamUuid: string; message: ChatMessage };
    }>(
      {
        query: `
          subscription ChatAdded($streamUuid: String!) {
            chatMessageAdded(streamUuid: $streamUuid) {
              streamUuid
              message {
                uuid
                create_date
                anon_id
                anon_text_color
                anon_background_color
                name
                message
              }
            }
          }
        `,
        variables: { streamUuid: uuid },
      },
      (data) => {
        setMessages((prev) => {
          const m = data.chatMessageAdded.message;
          if (prev.some((x) => x.uuid === m.uuid)) return prev;
          return [...prev, m];
        });
      },
    );

    const disposeStream = subscribe<{ streamUpdated: Stream }>(
      {
        query: `
          subscription StreamUpdated($uuid: String!) {
            streamUpdated(uuid: $uuid) {
              uuid
              title
              description
              status
            }
          }
        `,
        variables: { uuid },
      },
      (data) => setStream(data.streamUpdated),
    );

    // Redirect everyone to replay when processing completes
    // (handled by streamUpdated subscription updating state)

    return () => {
      disposeChat();
      disposeStream();
      disposeSignal();

      pcByPeerRef.current.forEach((pc) => pc.close());
      pcByPeerRef.current.clear();

      if (!isHost) {
        client.request(
          `mutation($uuid:String!,$peerId:String!){leaveStream(uuid:$uuid,peerId:$peerId)}`,
          { uuid, peerId },
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerId, uuid, isHost]);

  useEffect(() => {
    if (stream?.status === 'past') {
      router.push(`/stream/${uuid}`);
    }
  }, [router, stream?.status, uuid]);

  function getOrCreatePc(otherPeerId: string, asHost: boolean) {
    const existing = pcByPeerRef.current.get(otherPeerId);
    if (existing) return existing;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.onicecandidate = async (ev) => {
      if (!ev.candidate) return;
      const client = makeGqlClient(getToken() ?? undefined);
      await client.request(
        `mutation($streamUuid:String!,$toPeerId:String!,$fromPeerId:String!,$payload:String!){sendSignal(streamUuid:$streamUuid,toPeerId:$toPeerId,fromPeerId:$fromPeerId,payload:$payload)}`,
        {
          streamUuid: uuid,
          toPeerId: otherPeerId,
          fromPeerId: peerId,
          payload: JSON.stringify({ type: 'ice', candidate: ev.candidate }),
        },
      );
    };

    if (asHost) {
      // Host: attach local tracks
      const local = localStreamRef.current;
      if (local) {
        local.getTracks().forEach((t) => pc.addTrack(t, local));
      }
    } else {
      pc.ontrack = (ev) => {
        if (remoteVideoRef.current) {
          const [stream] = ev.streams;
          remoteVideoRef.current.srcObject = stream;
        }
      };
    }

    pcByPeerRef.current.set(otherPeerId, pc);
    return pc;
  }

  async function startHosting() {
    if (localStreamRef.current) return;
    try {
      setRtcError(null);
      const local = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = local;
      if (localVideoRef.current) localVideoRef.current.srcObject = local;

      // Recording: buffer blobs until ~CLIP_LENGTH_MB (default 50MB), then upload
      const clipLengthMb = Number(process.env.NEXT_PUBLIC_CLIP_LENGTH ?? 50);
      const clipBytes = clipLengthMb * 1024 * 1024;

      const rec = new MediaRecorder(local, { mimeType: 'video/webm;codecs=vp8,opus' });
      recorderRef.current = rec;

      rec.ondataavailable = async (ev) => {
        if (!ev.data || ev.data.size === 0) return;
        clipBufferRef.current.blobs.push(ev.data);
        clipBufferRef.current.bytes += ev.data.size;

        if (clipBufferRef.current.bytes >= clipBytes) {
          const blob = new Blob(clipBufferRef.current.blobs, { type: 'video/webm' });
          clipBufferRef.current = { blobs: [], bytes: 0 };
          await uploadBlob({
            url: clipUploadUrl(uuid),
            file: blob,
            filename: `clip-${Date.now()}.webm`,
            contentType: 'video/webm',
          });
        }
      };

      rec.start(5000); // 5s chunks for buffering
    } catch (e: any) {
      setRtcError(e?.name === 'NotAllowedError' ? 'Camera/mic permission denied.' : 'Failed to start camera/mic.');
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold">{stream?.title ?? 'Loading…'}</div>
          <div className="mt-1 text-sm text-slate-600">{stream?.description ?? ''}</div>
          <div className="mt-1 text-xs text-slate-500">Stream ID: {uuid}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
            onClick={async () => {
              await navigator.clipboard.writeText(window.location.href);
            }}
          >
            Copy Link
          </button>
          {getToken() ? (
            <button
              className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500"
              onClick={async () => {
                const client = makeGqlClient(getToken() ?? undefined);
                await client.request(`mutation($uuid:String!){endStream(uuid:$uuid){uuid status}}`, {
                  uuid,
                });
                setStream((s) => (s ? { ...s, status: 'processing' } : s));
              }}
            >
              End Stream
            </button>
          ) : null}
        </div>
      </div>

      {stream?.status === 'processing' ? (
        <div className="rounded-lg border bg-white p-6 text-center">
          <div className="text-lg font-semibold">Stream has ended</div>
          <div className="mt-1 text-sm text-slate-600">
            Once it has finished processing, you will be redirected.
          </div>
          <div className="mt-4 text-sm">
            (MVP: redirect will happen once processing is implemented.)
          </div>
          <div className="mt-3">
            <Link className="text-sm font-medium underline" href={`/stream/${uuid}`}>
              Go to replay page
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-lg border bg-white p-4">
            <div className="mb-2 text-sm font-medium">Live Stream</div>
            {isHost ? (
              <div className="space-y-3">
                {rtcError ? (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {rtcError}
                  </div>
                ) : null}
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-md border bg-black"
                />
                <button
                  className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
                  onClick={() => startHosting()}
                >
                  Start Camera + Broadcast
                </button>
                <div className="text-xs text-slate-600">
                  Viewer connections are established via GraphQL signaling (STUN-only).
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-md border bg-black"
                />
                <button
                  className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
                  onClick={async () => {
                    const client = makeGqlClient();
                    const pc = getOrCreatePc(`streamer-${uuid}`, false);
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    await client.request(
                      `mutation($streamUuid:String!,$toPeerId:String!,$fromPeerId:String!,$payload:String!){sendSignal(streamUuid:$streamUuid,toPeerId:$toPeerId,fromPeerId:$fromPeerId,payload:$payload)}`,
                      {
                        streamUuid: uuid,
                        toPeerId: `streamer-${uuid}`,
                        fromPeerId: peerId,
                        payload: JSON.stringify({ type: 'offer', sdp: pc.localDescription }),
                      },
                    );
                  }}
                >
                  Connect to Stream
                </button>
                <div className="text-xs text-slate-600">
                  (MVP) Direct viewer connection to the streamer.
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-white p-4">
            <div className="mb-2 text-sm font-medium">Live Chat</div>
            <div className="mb-3 flex items-center gap-2">
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Optional name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
                onClick={() => setAnonName(name)}
              >
                Set
              </button>
            </div>

            <div className="h-72 overflow-auto rounded-md border bg-slate-50 p-2">
              {messages.length === 0 ? (
                <div className="p-2 text-sm text-slate-600">No messages yet.</div>
              ) : (
                <div className="space-y-2">
                  {messages.map((m) => (
                    <div key={m.uuid} className="text-sm">
                      <span className="font-medium">{m.name || 'Anonymous'}</span>{' '}
                      <span
                        className="rounded px-1.5 py-0.5 text-xs"
                        style={{
                          color: m.anon_text_color,
                          backgroundColor: m.anon_background_color,
                        }}
                      >
                        {m.anon_id}
                      </span>
                      <div className="mt-0.5 text-slate-800">{m.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Write a message…"
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
              />
              <button
                className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
                onClick={async () => {
                  const msg = chatText.trim();
                  if (!msg) return;
                  setChatText('');
                  const anon = getOrCreateAnonSession();
                  const client = makeGqlClient();
                  const res = await client.request<{ sendChatMessage: ChatMessage }>(
                    `
                      mutation Send(
                        $streamUuid: String!
                        $message: String!
                        $name: String
                        $anon_id: String
                        $anon_text_color: String
                        $anon_background_color: String
                      ) {
                        sendChatMessage(
                          streamUuid: $streamUuid
                          message: $message
                          name: $name
                          anon_id: $anon_id
                          anon_text_color: $anon_text_color
                          anon_background_color: $anon_background_color
                        ) {
                          uuid
                          create_date
                          anon_id
                          anon_text_color
                          anon_background_color
                          name
                          message
                        }
                      }
                    `,
                    {
                      streamUuid: uuid,
                      message: msg,
                      name: name || undefined,
                      anon_id: anon.anon_id,
                      anon_text_color: anon.anon_text_color,
                      anon_background_color: anon.anon_background_color,
                    },
                  );
                  setMessages((prev) => [...prev, res.sendChatMessage]);
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


