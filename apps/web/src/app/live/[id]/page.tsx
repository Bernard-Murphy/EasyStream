"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { makeGqlClient } from "@/lib/graphql";
import { getOrCreateAnonSession, setAnonName } from "@/lib/anonSession";
import { getToken } from "@/lib/auth";
import Link from "next/link";
import { subscribe } from "@/lib/graphqlWs";
import { clipUploadUrl, uploadBlob } from "@/lib/uploads";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CONFIG } from "@/lib/config";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Stream = {
  uuid: string;
  title: string;
  description: string;
  status: "live" | "processing" | "past";
  removed?: boolean;
};

type ChatMessage = {
  uuid: string;
  create_date: string;
  anon_id: string;
  anon_text_color: string;
  anon_background_color: string;
  name?: string | null;
  message: string;
  removed?: boolean;
};

type StreamPosition = {
  stage: number;
  peer_id: string;
  parents: string[];
  children: string[];
};

export default function LiveStreamPage() {
  const params = useParams<{ id: string }>();
  const uuid = params.id;
  const router = useRouter();

  const [stream, setStream] = useState<Stream | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatText, setChatText] = useState("");
  const [name, setName] = useState("");
  const [positions, setPositions] = useState<StreamPosition[]>([]);

  const isHost = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(`easystream:host:${uuid}`) === "true";
  }, [uuid]);

  const hostToken = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(`easystream:hostToken:${uuid}`);
  }, [uuid]);

  const peerId = useMemo(() => {
    return isHost ? `streamer-${uuid}` : `peer-${crypto.randomUUID()}`;
  }, [isHost, uuid]);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pcByPeerRef = useRef(new Map<string, RTCPeerConnection>());
  const pcRoleByPeerRef = useRef(new Map<string, "sender" | "receiver">());
  const senderTracksByPeerRef = useRef(new Map<string, RTCRtpSender[]>());
  const upstreamStreamsByPeerRef = useRef(new Map<string, MediaStream>());
  const activeUpstreamPeerRef = useRef<string | null>(null);
  const relaySourceStreamRef = useRef<MediaStream | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const clipBufferRef = useRef<{ blobs: Blob[]; bytes: number }>({
    blobs: [],
    bytes: 0,
  });
  const uploadQueueRef = useRef<Promise<void>>(Promise.resolve());

  const myPosition = useMemo(() => {
    return positions.find((p) => p.peer_id === peerId) ?? null;
  }, [peerId, positions]);

  function queueUpload(fn: () => Promise<void>) {
    uploadQueueRef.current = uploadQueueRef.current.then(fn).catch(() => {});
    return uploadQueueRef.current;
  }

  useEffect(() => {
    const client = makeGqlClient();
    client
      .request<{
        stream: Stream;
      }>(
        `query($uuid:String!){stream(uuid:$uuid){uuid title description status removed}}`,
        { uuid }
      )
      .then((r) => setStream(r.stream))
      .catch((e: unknown) => {
        const msg =
          (e as { response?: { errors?: Array<{ message?: string }> } })
            ?.response?.errors?.[0]?.message ??
          "Stream not found (or removed).";
        setStreamError(msg);
      });

    client
      .request<{
        chatMessages: ChatMessage[];
      }>(
        `query($streamUuid:String!){chatMessages(streamUuid:$streamUuid){uuid create_date anon_id anon_text_color anon_background_color name message}}`,
        { streamUuid: uuid }
      )
      .then((r) => setMessages(r.chatMessages));

    client
      .request<{ streamPositions: StreamPosition[] }>(
        `query($uuid:String!){streamPositions(uuid:$uuid){stage peer_id parents children}}`,
        { uuid }
      )
      .then((r) => setPositions(r.streamPositions))
      .catch(() => {});

    if (!isHost) {
      client.request(
        `mutation($uuid:String!,$peerId:String!){joinStream(uuid:$uuid,peerId:$peerId)}`,
        {
          uuid,
          peerId,
        }
      );
    }

    // Keep presence fresh + best-effort unload cleanup.
    const heartbeatInterval = window.setInterval(() => {
      client
        .request(
          `mutation($uuid:String!,$peerId:String!){heartbeatStream(uuid:$uuid,peerId:$peerId)}`,
          { uuid, peerId }
        )
        .catch(() => {});
    }, 10_000);

    const sendBeaconLeave = () => {
      try {
        if (isHost) return;
        const url = `${CONFIG.restUrl}/streams/${uuid}/leave`;
        const body = JSON.stringify({ peerId });
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon(url, blob);
      } catch {
        // ignore
      }
    };

    window.addEventListener("beforeunload", sendBeaconLeave);

    const disposeSignal = subscribe<{
      signalReceived: {
        fromPeerId: string;
        payload: string;
      };
    }>(
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
        const msg = data.signalReceived;
        const payload = JSON.parse(msg.payload) as unknown;
        if (!payload || typeof payload !== "object") return;
        const p = payload as Record<string, unknown>;
        const type = p.type;
        if (typeof type !== "string") return;

        if (type === "request-offer") {
          // Child is asking parent to initiate connection.
          await ensureOfferToPeer(msg.fromPeerId);
          return;
        }

        if (type === "offer") {
          const pc = getOrCreatePc(msg.fromPeerId, "receiver");
          if (p.sdp)
            await pc.setRemoteDescription(p.sdp as RTCSessionDescriptionInit);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          const gql = makeGqlClient(getToken() ?? undefined);
          await gql.request(
            `mutation($streamUuid:String!,$toPeerId:String!,$fromPeerId:String!,$payload:String!){sendSignal(streamUuid:$streamUuid,toPeerId:$toPeerId,fromPeerId:$fromPeerId,payload:$payload)}`,
            {
              streamUuid: uuid,
              toPeerId: msg.fromPeerId,
              fromPeerId: peerId,
              payload: JSON.stringify({
                type: "answer",
                sdp: pc.localDescription,
              }),
            }
          );
          return;
        }

        if (type === "answer") {
          const pc = pcByPeerRef.current.get(msg.fromPeerId);
          if (pc && p.sdp)
            await pc.setRemoteDescription(p.sdp as RTCSessionDescriptionInit);
          return;
        }

        if (type === "ice") {
          const pc = pcByPeerRef.current.get(msg.fromPeerId);
          if (pc && p.candidate) {
            try {
              await pc.addIceCandidate(p.candidate as RTCIceCandidateInit);
            } catch {
              // ignore race
            }
          }
        }
      }
    );

    const disposeHierarchy = subscribe<{
      hierarchyUpdated: { streamUuid: string; positions: StreamPosition[] };
    }>(
      {
        query: `
          subscription Hierarchy($uuid: String!) {
            hierarchyUpdated(uuid: $uuid) {
              streamUuid
              positions { stage peer_id parents children }
            }
          }
        `,
        variables: { uuid },
      },
      (data) => {
        setPositions(data.hierarchyUpdated.positions);
      }
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
      }
    );

    const disposeChatUpdated = subscribe<{
      chatMessageUpdated: { streamUuid: string; message: ChatMessage };
    }>(
      {
        query: `
          subscription ChatUpdated($streamUuid: String!) {
            chatMessageUpdated(streamUuid: $streamUuid) {
              streamUuid
              message {
                uuid
                create_date
                anon_id
                anon_text_color
                anon_background_color
                name
                message
                removed
              }
            }
          }
        `,
        variables: { streamUuid: uuid },
      },
      (data) => {
        const m = data.chatMessageUpdated.message;
        setMessages((prev) =>
          prev.map((x) =>
            x.uuid === m.uuid ? { ...x, removed: m.removed } : x
          )
        );
      }
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
              removed
            }
          }
        `,
        variables: { uuid },
      },
      (data) => setStream(data.streamUpdated)
    );

    // Redirect everyone to replay when processing completes
    // (handled by streamUpdated subscription updating state)

    return () => {
      window.clearInterval(heartbeatInterval);
      window.removeEventListener("beforeunload", sendBeaconLeave);
      offerRetryRef.current.forEach((v) => {
        if (v.timer) window.clearTimeout(v.timer);
      });
      offerRetryRef.current.clear();
      disposeChat();
      disposeChatUpdated();
      disposeStream();
      disposeSignal();
      disposeHierarchy();

      pcByPeerRef.current.forEach((pc) => pc.close());
      pcByPeerRef.current.clear();
      pcRoleByPeerRef.current.clear();
      senderTracksByPeerRef.current.clear();
      upstreamStreamsByPeerRef.current.clear();

      if (!isHost) {
        client.request(
          `mutation($uuid:String!,$peerId:String!){leaveStream(uuid:$uuid,peerId:$peerId)}`,
          { uuid, peerId }
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerId, uuid, isHost]);

  useEffect(() => {
    if (stream?.removed) {
      // Stream was moderated away; stop any ongoing connections and send user back to listings.
      pcByPeerRef.current.forEach((pc) => pc.close());
      pcByPeerRef.current.clear();
      router.push(`/browse-live`);
      return;
    }
    if (stream?.status === "past") {
      router.push(`/stream/${uuid}`);
    }
  }, [router, stream?.removed, stream?.status, uuid]);

  useEffect(() => {
    // Whenever hierarchy changes, ensure we have the right upstream/downstream connections.
    syncConnections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions, myPosition?.peer_id]);

  useEffect(() => {
    // If a moderator ends the stream, make sure the host flushes the final partial clip.
    if (stream?.status === "processing" && isHost) {
      stopRecordingAndUploadFinalClip().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHost, stream?.status]);

  function getOrCreatePc(otherPeerId: string, role: "sender" | "receiver") {
    const existing = pcByPeerRef.current.get(otherPeerId);
    if (existing) return existing;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
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
          payload: JSON.stringify({ type: "ice", candidate: ev.candidate }),
        }
      );
    };

    pc.onconnectionstatechange = () => {
      if (role === "receiver") {
        // If the active upstream drops, switch to another.
        if (
          pc.connectionState === "failed" ||
          pc.connectionState === "disconnected"
        ) {
          // Tear down and re-request an offer if we still want this parent.
          closePeer(otherPeerId);
          if ((myPosition?.parents ?? []).includes(otherPeerId)) {
            requestOfferFromParent(otherPeerId).catch(() => {});
          }
          selectActiveUpstream();
        }
      } else {
        if (
          pc.connectionState === "failed" ||
          pc.connectionState === "disconnected"
        ) {
          // Tear down and re-offer if we still have this child.
          closePeer(otherPeerId);
          if ((myPosition?.children ?? []).includes(otherPeerId)) {
            setTimeout(() => {
              ensureOfferToPeer(otherPeerId).catch(() => {});
            }, 1000);
          }
        }
      }
    };

    if (role === "sender") {
      attachRelayTracksToSenderPc(otherPeerId, pc);
    } else {
      pc.ontrack = (ev) => {
        const [s] = ev.streams;
        if (!s) return;
        upstreamStreamsByPeerRef.current.set(otherPeerId, s);
        selectActiveUpstream();
      };
    }

    pcByPeerRef.current.set(otherPeerId, pc);
    pcRoleByPeerRef.current.set(otherPeerId, role);
    return pc;
  }

  function getRelaySourceStream(): MediaStream | null {
    if (isHost) return localStreamRef.current;
    return relaySourceStreamRef.current;
  }

  function attachRelayTracksToSenderPc(
    otherPeerId: string,
    pc: RTCPeerConnection
  ) {
    const src = getRelaySourceStream();
    if (!src) return;
    const senders: RTCRtpSender[] = [];
    src.getTracks().forEach((t) => {
      try {
        senders.push(pc.addTrack(t, src));
      } catch {
        // ignore
      }
    });
    senderTracksByPeerRef.current.set(otherPeerId, senders);
  }

  function replaceRelayTracksOnSenderPc(
    otherPeerId: string,
    pc: RTCPeerConnection
  ) {
    const src = getRelaySourceStream();
    if (!src) return;
    const senders = senderTracksByPeerRef.current.get(otherPeerId) ?? [];
    const byKind = new Map(src.getTracks().map((t) => [t.kind, t]));
    senders.forEach((s) => {
      const kind = s.track?.kind;
      const next = kind ? (byKind.get(kind) ?? null) : null;
      s.replaceTrack(next).catch(() => {});
    });
  }

  function selectActiveUpstream() {
    if (isHost) return;
    const parentOrder = myPosition?.parents ?? [];
    const map = upstreamStreamsByPeerRef.current;
    const next =
      parentOrder.find((p) => map.has(p)) ??
      (map.keys().next().value as string | undefined);
    if (!next) return;
    activeUpstreamPeerRef.current = next;
    const stream = map.get(next) ?? null;
    if (stream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
    }
    relaySourceStreamRef.current = stream;

    // If we're a relay for downstream peers, swap tracks.
    for (const child of myPosition?.children ?? []) {
      const pc = pcByPeerRef.current.get(child);
      if (pc && pcRoleByPeerRef.current.get(child) === "sender") {
        replaceRelayTracksOnSenderPc(child, pc);
      }
    }

    // Now that we have an upstream source, ensure downstream offers can be created.
    syncConnections();
  }

  async function requestOfferFromParent(parentPeerId: string) {
    const client = makeGqlClient(getToken() ?? undefined);
    await client.request(
      `mutation($streamUuid:String!,$toPeerId:String!,$fromPeerId:String!,$payload:String!){sendSignal(streamUuid:$streamUuid,toPeerId:$toPeerId,fromPeerId:$fromPeerId,payload:$payload)}`,
      {
        streamUuid: uuid,
        toPeerId: parentPeerId,
        fromPeerId: peerId,
        payload: JSON.stringify({ type: "request-offer" }),
      }
    );
  }

  async function ensureOfferToPeer(childPeerId: string) {
    const shouldServe = (myPosition?.children ?? []).includes(childPeerId);
    if (!shouldServe) return;
    const src = getRelaySourceStream();
    if (!src) return;

    const pc = getOrCreatePc(childPeerId, "sender");
    // Ensure tracks are attached (or replaced) before offering.
    if (!senderTracksByPeerRef.current.has(childPeerId)) {
      attachRelayTracksToSenderPc(childPeerId, pc);
    } else {
      replaceRelayTracksOnSenderPc(childPeerId, pc);
    }

    if (pc.signalingState !== "stable") return;
    if (pc.localDescription) return;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    const client = makeGqlClient(getToken() ?? undefined);
    await client.request(
      `mutation($streamUuid:String!,$toPeerId:String!,$fromPeerId:String!,$payload:String!){sendSignal(streamUuid:$streamUuid,toPeerId:$toPeerId,fromPeerId:$fromPeerId,payload:$payload)}`,
      {
        streamUuid: uuid,
        toPeerId: childPeerId,
        fromPeerId: peerId,
        payload: JSON.stringify({
          type: "offer",
          sdp: pc.localDescription,
        }),
      }
    );
  }

  function closePeer(otherPeerId: string) {
    const pc = pcByPeerRef.current.get(otherPeerId);
    if (pc) pc.close();
    pcByPeerRef.current.delete(otherPeerId);
    pcRoleByPeerRef.current.delete(otherPeerId);
    senderTracksByPeerRef.current.delete(otherPeerId);
    upstreamStreamsByPeerRef.current.delete(otherPeerId);
    if (activeUpstreamPeerRef.current === otherPeerId) {
      activeUpstreamPeerRef.current = null;
    }
  }

  function syncConnections() {
    const my = myPosition;
    if (!my) return;

    const parents = my.parents ?? [];
    const children = my.children ?? [];

    // Close connections that are no longer relevant.
    for (const otherPeerId of pcByPeerRef.current.keys()) {
      if (!parents.includes(otherPeerId) && !children.includes(otherPeerId)) {
        closePeer(otherPeerId);
      }
    }

    // Upstream: request offers from parents (parent initiates).
    for (const p of parents) {
      const existing = pcByPeerRef.current.get(p);
      if (!existing) {
        requestOfferFromParentWithRetry(p);
      }
    }

    // Downstream: initiate offers to children if we have a relay source.
    for (const c of children) {
      ensureOfferToPeer(c).catch(() => {});
    }
  }

  const offerRetryRef = useRef(
    new Map<string, { attempts: number; timer?: number }>()
  );

  function requestOfferFromParentWithRetry(parentPeerId: string) {
    const state = offerRetryRef.current.get(parentPeerId) ?? { attempts: 0 };
    // exponential backoff: 0.5s, 1s, 2s, 4s, 8s (cap)
    const delay = Math.min(8000, 500 * Math.pow(2, state.attempts));
    state.attempts += 1;
    if (state.timer) window.clearTimeout(state.timer);
    state.timer = window.setTimeout(() => {
      requestOfferFromParent(parentPeerId)
        .catch(() => {})
        .finally(() => {
          // If we still don't have a PC for this parent, retry again.
          if (
            (myPosition?.parents ?? []).includes(parentPeerId) &&
            !pcByPeerRef.current.has(parentPeerId)
          ) {
            requestOfferFromParentWithRetry(parentPeerId);
          }
        });
    }, delay);
    offerRetryRef.current.set(parentPeerId, state);
  }

  async function stopRecordingAndUploadFinalClip() {
    const rec = recorderRef.current;
    if (!rec) return;
    recorderRef.current = null;

    await new Promise<void>((resolve) => {
      const onStop = () => resolve();
      try {
        rec.addEventListener("stop", onStop, { once: true });
        rec.requestData();
        rec.stop();
      } catch {
        resolve();
      }
    });

    // Upload any remaining buffered media, even if under CLIP_LENGTH.
    const pending = clipBufferRef.current;
    if (pending.bytes > 0 && pending.blobs.length > 0) {
      const blob = new Blob(pending.blobs, { type: "video/webm" });
      clipBufferRef.current = { blobs: [], bytes: 0 };
      await queueUpload(async () => {
        await uploadBlob({
          url: clipUploadUrl(uuid),
          file: blob,
          filename: `clip-final-${Date.now()}.webm`,
          contentType: "video/webm",
        });
      });
    }
  }

  async function startHosting() {
    if (localStreamRef.current) return;
    try {
      const raw = window.localStorage.getItem(`easystream:hostMedia:${uuid}`);
      const parsed = raw ? (JSON.parse(raw) as unknown) : null;
      const local = await navigator.mediaDevices.getUserMedia(
        (parsed as MediaStreamConstraints) ?? { video: true, audio: true }
      );
      localStreamRef.current = local;
      relaySourceStreamRef.current = local;
      if (localVideoRef.current) localVideoRef.current.srcObject = local;

      // Recording: buffer blobs until ~CLIP_LENGTH_MB (default 50MB), then upload
      const clipLengthMb = Number(process.env.NEXT_PUBLIC_CLIP_LENGTH ?? 50);
      const clipBytes = clipLengthMb * 1024 * 1024;

      const rec = new MediaRecorder(local, {
        mimeType: "video/webm;codecs=vp8,opus",
      });
      recorderRef.current = rec;

      rec.ondataavailable = async (ev) => {
        if (!ev.data || ev.data.size === 0) return;
        clipBufferRef.current.blobs.push(ev.data);
        clipBufferRef.current.bytes += ev.data.size;

        if (clipBufferRef.current.bytes >= clipBytes) {
          const blob = new Blob(clipBufferRef.current.blobs, {
            type: "video/webm",
          });
          clipBufferRef.current = { blobs: [], bytes: 0 };
          await queueUpload(async () => {
            await uploadBlob({
              url: clipUploadUrl(uuid),
              file: blob,
              filename: `clip-${Date.now()}.webm`,
              contentType: "video/webm",
            });
          });
        }
      };

      rec.start(5000); // 5s chunks for buffering

      // Now that we have a source stream, initiate offers to current children.
      syncConnections();
    } catch (e: unknown) {
      toast.warning(
        (e as { name?: string })?.name === "NotAllowedError"
          ? "Camera/mic permission denied."
          : "Failed to start camera/mic."
      );
    }
  }

  return (
    <div className="mx-auto w-full px-4 py-8">
      {streamError ? (
        <Card>
          <CardHeader>
            <CardTitle>Stream unavailable</CardTitle>
            <CardDescription>{streamError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="px-0">
              <Link href="/browse-live">Browse live streams</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <div className="text-2xl font-semibold">
                {stream?.title ?? "Loading…"}
              </div>

              <div className="mt-1 text-xs text-zinc-500">
                Stream ID: {uuid}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    toast.info("Link copied");
                  } catch {
                    toast.warning("Failed to copy link");
                  }
                }}
              >
                Copy Link
              </Button>
              {getToken() ? (
                <Button
                  variant="destructive"
                  onClick={async () => {
                    const client = makeGqlClient(getToken() ?? undefined);
                    if (isHost) {
                      await stopRecordingAndUploadFinalClip();
                      await uploadQueueRef.current;
                      try {
                        localStreamRef.current
                          ?.getTracks()
                          .forEach((t) => t.stop());
                      } catch {
                        // ignore
                      }
                    }
                    await client.request(
                      `mutation($uuid:String!){endStream(uuid:$uuid){uuid status}}`,
                      {
                        uuid,
                      }
                    );
                    setStream((s) => (s ? { ...s, status: "processing" } : s));
                  }}
                >
                  End Stream
                </Button>
              ) : isHost && hostToken ? (
                <Button
                  variant="destructive"
                  onClick={async () => {
                    const client = makeGqlClient();
                    await stopRecordingAndUploadFinalClip();
                    await uploadQueueRef.current;
                    try {
                      localStreamRef.current
                        ?.getTracks()
                        .forEach((t) => t.stop());
                    } catch {
                      // ignore
                    }
                    await client.request(
                      `mutation($uuid:String!,$hostToken:String!){endStreamAsHost(uuid:$uuid,hostToken:$hostToken){uuid status}}`,
                      { uuid, hostToken }
                    );
                    setStream((s) => (s ? { ...s, status: "processing" } : s));
                  }}
                >
                  End Stream
                </Button>
              ) : null}
            </div>
          </div>

          {stream?.status === "processing" ? (
            <Card>
              <CardHeader>
                <CardTitle>Stream has ended</CardTitle>
                <CardDescription>
                  Once it has finished processing, you will be redirected.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="px-0">
                  <Link href={`/stream/${uuid}`}>Go to replay page</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Live Stream</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {isHost ? (
                    <div className="space-y-3">
                      <div className="relative w-full">
                        <div className="pointer-events-none relative overflow-hidden rounded-md border bg-black pb-[56.25%]">
                          <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      <Button onClick={() => startHosting()}>
                        Start Camera + Broadcast
                      </Button>
                      <div className="text-xs text-zinc-600">
                        Waterfall connections are established via hierarchy
                        updates + GraphQL signaling (STUN-only).
                      </div>
                      {myPosition ? (
                        <div className="text-xs text-zinc-500">
                          Stage {myPosition.stage} • children:{" "}
                          {(myPosition.children ?? []).length}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative w-full">
                        <div className="pointer-events-none relative overflow-hidden rounded-md border bg-black pb-[56.25%]">
                          <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="text-xs text-zinc-600">
                        Auto-connecting using the waterfall hierarchy (parents:{" "}
                        {(myPosition?.parents ?? []).length}, stage{" "}
                        {myPosition?.stage ?? "…"}).
                      </div>
                    </div>
                  )}
                  <hr className="my-4 border-input" />
                  <div className="text-sm text-zinc-300">
                    {stream?.description ?? ""}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Live Chat</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="mb-3 flex items-center gap-2">
                    <Input
                      placeholder="Optional name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Button variant="outline" onClick={() => setAnonName(name)}>
                      Set
                    </Button>
                  </div>

                  <div className="h-72 overflow-auto rounded-md border bg-muted/30 p-2">
                    {messages.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No messages yet.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {messages
                          .filter((m) => !m.removed)
                          .map((m) => (
                            <div key={m.uuid} className="group text-sm">
                              <span className="font-medium">
                                {m.name || "Anonymous"}
                              </span>{" "}
                              <span
                                className="rounded px-1.5 py-0.5 text-xs"
                                style={{
                                  color: m.anon_text_color,
                                  backgroundColor: m.anon_background_color,
                                }}
                              >
                                {m.anon_id}
                              </span>
                              {getToken() ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="ml-2 h-7 px-2 py-0.5 text-xs opacity-0 transition group-hover:opacity-100"
                                  title="Remove message"
                                  onClick={async () => {
                                    try {
                                      const client = makeGqlClient(
                                        getToken() ?? undefined
                                      );
                                      await client.request(
                                        `mutation($uuid:String!){removeChatMessage(uuid:$uuid){uuid removed}}`,
                                        { uuid: m.uuid }
                                      );
                                      toast.info("Message removed");
                                    } catch (e: unknown) {
                                      const msg =
                                        (
                                          e as {
                                            response?: {
                                              errors?: Array<{
                                                message?: string;
                                              }>;
                                            };
                                          }
                                        )?.response?.errors?.[0]?.message ??
                                        "Failed to remove";
                                      toast.warning(msg);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Remove
                                </Button>
                              ) : null}
                              <div className="mt-0.5 text-zinc-800">
                                {m.message}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Input
                      placeholder="Write a message…"
                      value={chatText}
                      onChange={(e) => setChatText(e.target.value)}
                    />
                    <Button
                      onClick={async () => {
                        const msg = chatText.trim();
                        if (!msg) return;
                        setChatText("");
                        const anon = getOrCreateAnonSession();
                        const client = makeGqlClient();
                        const res = await client.request<{
                          sendChatMessage: ChatMessage;
                        }>(
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
                          }
                        );
                        setMessages((prev) => [...prev, res.sendChatMessage]);
                      }}
                    >
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
