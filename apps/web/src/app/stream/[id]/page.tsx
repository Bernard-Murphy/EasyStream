 "use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { makeGqlClient } from "@/lib/graphql";
import Link from "next/link";
import { getToken } from "@/lib/auth";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type Stream = {
  uuid: string;
  title: string;
  description: string;
  status: "live" | "processing" | "past";
  fileUrls: string[];
  start_time: string;
  removed?: boolean;
};

export default function StreamReplayPage() {
  const params = useParams<{ id: string }>();
  const uuid = params.id;
  const [stream, setStream] = useState<Stream | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    Array<{
      uuid: string;
      create_date: string;
      anon_id: string;
      anon_text_color: string;
      anon_background_color: string;
      name?: string | null;
      message: string;
      removed?: boolean;
    }>
  >([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [durations, setDurations] = useState<number[]>([]);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    const client = makeGqlClient();
    client
      .request<{
        stream: Stream;
      }>(
        `query($uuid:String!){stream(uuid:$uuid){uuid title description status fileUrls start_time removed}}`,
        { uuid }
      )
      .then((r) => setStream(r.stream))
      .catch((e: any) => {
        setStreamError(
          e?.response?.errors?.[0]?.message ?? "Stream not found (or removed)."
        );
      });

    client
      .request<{
        chatMessages: Array<{
          uuid: string;
          create_date: string;
          anon_id: string;
          anon_text_color: string;
          anon_background_color: string;
          name?: string | null;
          message: string;
        }>;
      }>(
        `query($streamUuid:String!){chatMessages(streamUuid:$streamUuid){uuid create_date anon_id anon_text_color anon_background_color name message}}`,
        { streamUuid: uuid }
      )
      .then((r) => setMessages(r.chatMessages));
  }, [uuid]);

  useEffect(() => {
    // Stop all other players when active changes
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i !== activeIndex) {
        v.pause();
        v.currentTime = 0;
      }
    });
    setCurrentTime(0);
  }, [activeIndex]);

  const baseOffsets = useMemo(() => {
    const offs: number[] = [];
    let sum = 0;
    for (let i = 0; i < (stream?.fileUrls?.length ?? 0); i++) {
      offs.push(sum);
      sum += durations[i] ?? 0;
    }
    return offs;
  }, [durations, stream?.fileUrls?.length]);

  const syncedMessages = useMemo(() => {
    if (!stream) return [];
    const startMs = new Date(stream.start_time).getTime();
    const absoluteSec = (baseOffsets[activeIndex] ?? 0) + currentTime;
    return messages
      .map((m) => ({
        ...m,
        offsetSec: (new Date(m.create_date).getTime() - startMs) / 1000,
      }))
      .filter((m) => !m.removed)
      .filter((m) => m.offsetSec <= absoluteSec)
      .slice(-200);
  }, [activeIndex, baseOffsets, currentTime, messages, stream]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {streamError ? (
        <div className="rounded-lg border bg-white p-6 text-center">
          <div className="text-lg font-semibold">Stream unavailable</div>
          <div className="mt-2 text-sm text-zinc-600">{streamError}</div>
          <div className="mt-4">
            <Link className="text-sm font-medium underline" href="/browse-past">
              Browse past streams
            </Link>
          </div>
        </div>
      ) : null}
      {streamError ? null : (
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold">
            {stream?.title ?? "Loading…"}
          </div>
          <div className="mt-1 text-sm text-zinc-600">
            {stream?.description ?? ""}
          </div>
        </div>
        <Link
          className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-50"
          href={`/live/${uuid}`}
        >
          Back to Live Page
        </Link>
      </div>
      {getToken() ? (
        <div className="mb-4 flex justify-end">
          <button
            className="rounded-md bg-red-600 px-3 py-2 text-sm text-gray-200 hover:bg-red-500"
            onClick={async () => {
              try {
                const client = makeGqlClient(getToken() ?? undefined);
                await client.request(
                  `mutation($uuid:String!){removeStream(uuid:$uuid){uuid removed}}`,
                  { uuid }
                );
                toast.info("Stream removed");
              } catch (e: any) {
                toast.warning(
                  e?.response?.errors?.[0]?.message ?? "Failed to remove stream"
                );
              }
            }}
          >
            Remove Stream
          </button>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border bg-white p-4">
          <div className="mb-2 text-sm font-medium">Replay</div>
          {stream?.removed ? (
            <div className="text-sm text-zinc-600">
              This stream has been removed by a moderator.
              <div className="mt-2">
                <Link className="underline" href="/browse-past">
                  Browse past streams
                </Link>
              </div>
            </div>
          ) : null}
          {stream?.removed ? null : stream?.status !== "past" ? (
            <div className="text-sm text-zinc-600">
              Stream is not processed yet (status: {stream?.status ?? "…"}).
            </div>
          ) : (stream.fileUrls?.length ?? 0) === 0 ? (
            <div className="text-sm text-zinc-600">No files available.</div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {stream.fileUrls.map((_, idx) => (
                  <button
                    key={idx}
                    className={`rounded-md border px-3 py-1.5 text-sm ${
                      idx === activeIndex
                        ? "bg-zinc-900 text-gray-200"
                        : "hover:bg-zinc-50"
                    }`}
                    onClick={() => setActiveIndex(idx)}
                  >
                    Part {idx + 1}
                  </button>
                ))}
              </div>

              {stream.fileUrls.map((url, idx) => (
                <div
                  key={url}
                  className={idx === activeIndex ? "block" : "hidden"}
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[idx] = el;
                    }}
                    src={url}
                    controls
                    playsInline
                    className="w-full rounded-md border bg-black"
                    onTimeUpdate={(e) => {
                      if (idx !== activeIndex) return;
                      setCurrentTime(
                        (e.target as HTMLVideoElement).currentTime
                      );
                    }}
                    onLoadedMetadata={(e) => {
                      const d = (e.target as HTMLVideoElement).duration || 0;
                      setDurations((prev) => {
                        const next = prev.slice();
                        next[idx] = d;
                        return next;
                      });
                    }}
                    onPlay={() => setActiveIndex(idx)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="mb-2 text-sm font-medium">Chat Replay</div>
          <div className="text-xs text-zinc-500">
            Showing messages up to{" "}
            {(baseOffsets[activeIndex] ?? 0) + currentTime}s.
          </div>
          <div className="mt-2 h-[28rem] overflow-auto rounded-md border bg-zinc-50 p-2">
            {syncedMessages.length === 0 ? (
              <div className="p-2 text-sm text-zinc-600">No messages yet.</div>
            ) : (
              <div className="space-y-2">
                {syncedMessages.map((m) => (
                  <div key={m.uuid} className="group text-sm">
                    <span className="font-medium">{m.name || "Anonymous"}</span>{" "}
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
                      <button
                        className="ml-2 inline-flex items-center gap-1 rounded border bg-white px-2 py-0.5 text-xs text-zinc-700 opacity-0 transition group-hover:opacity-100 hover:bg-zinc-50"
                        title="Remove message"
                        onClick={async () => {
                          try {
                            const client = makeGqlClient(getToken() ?? undefined);
                            await client.request(
                              `mutation($uuid:String!){removeChatMessage(uuid:$uuid){uuid removed}}`,
                              { uuid: m.uuid }
                            );
                            toast.info("Message removed");
                            setMessages((prev) =>
                              prev.map((x) =>
                                x.uuid === m.uuid ? { ...x, removed: true } : x
                              )
                            );
                          } catch (e: any) {
                            toast.warning(
                              e?.response?.errors?.[0]?.message ?? "Failed to remove"
                            );
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    ) : null}
                      <div className="mt-0.5 text-zinc-800">{m.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
