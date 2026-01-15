"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { makeGqlClient } from "@/lib/graphql";
import Link from "next/link";
import { getToken } from "@/lib/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BouncyClick from "@/components/ui/bouncy-click";

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
      .catch((e: unknown) => {
        const msg =
          (e as { response?: { errors?: Array<{ message?: string }> } })
            ?.response?.errors?.[0]?.message ??
          "Stream not found (or removed).";
        setStreamError(msg);
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

  const activateIndex = (idx: number) => {
    // Stop all other players when active changes
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i !== idx) {
        v.pause();
        v.currentTime = 0;
      }
    });
    setCurrentTime(0);
    setActiveIndex(idx);
  };

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
    <div className="mx-auto max-w-full px-4 py-8 flex flex-col min-h-[90vh]">
      {streamError ? (
        <Card>
          <CardHeader>
            <CardTitle>Stream unavailable</CardTitle>
            <CardDescription>{streamError}</CardDescription>
          </CardHeader>
          <CardContent>
            <BouncyClick>
              <Button asChild variant="link" className="px-0">
                <Link href="/browse-past">Browse past streams</Link>
              </Button>
            </BouncyClick>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <div className="text-2xl font-semibold">
                {stream?.title ?? "Loading…"}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Replay</div>
            </div>
          </div>
          {getToken() ? (
            <div className="mb-4 flex justify-end">
              <BouncyClick>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    try {
                      const client = makeGqlClient(getToken() ?? undefined);
                      await client.request(
                        `mutation($uuid:String!){removeStream(uuid:$uuid){uuid removed}}`,
                        { uuid }
                      );
                      toast.info("Stream removed");
                    } catch (e: unknown) {
                      const msg =
                        (
                          e as {
                            response?: { errors?: Array<{ message?: string }> };
                          }
                        )?.response?.errors?.[0]?.message ??
                        "Failed to remove stream";
                      toast.warning(msg);
                    }
                  }}
                >
                  Remove Stream
                </Button>
              </BouncyClick>
            </div>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-[2fr_1fr] flex-1">
            <Card>
              <CardContent className="pt-0">
                {stream?.removed ? (
                  <div className="text-sm text-muted-foreground">
                    This stream has been removed by a moderator.
                    <div className="mt-2">
                      <BouncyClick>
                        <Button asChild variant="link" className="px-0">
                          <Link href="/browse-past">Browse past streams</Link>
                        </Button>
                      </BouncyClick>
                    </div>
                  </div>
                ) : null}
                {stream?.removed ? null : stream?.status !== "past" ? (
                  <div className="text-sm text-muted-foreground">
                    Stream is not processed yet (status: {stream?.status ?? "…"}
                    ).
                  </div>
                ) : (stream.fileUrls?.length ?? 0) === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No files available.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {stream.fileUrls.map((_, idx) => (
                        <BouncyClick key={idx}>
                          <Button
                            key={idx}
                            variant={
                              idx === activeIndex ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => activateIndex(idx)}
                          >
                            Part {idx + 1}
                          </Button>
                        </BouncyClick>
                      ))}
                    </div>

                    {stream.fileUrls.map((url, idx) => (
                      <div
                        key={url}
                        className={idx === activeIndex ? "block" : "hidden"}
                      >
                        <div className="relative w-full">
                          <div className="relative overflow-hidden rounded-md border bg-black pb-[54%]">
                            <video
                              ref={(el) => {
                                videoRefs.current[idx] = el;
                              }}
                              src={url}
                              controls
                              playsInline
                              onTimeUpdate={(e) => {
                                if (idx !== activeIndex) return;
                                setCurrentTime(
                                  (e.target as HTMLVideoElement).currentTime
                                );
                              }}
                              className="absolute inset-0 h-full w-full object-cover"
                              onLoadedMetadata={(e) => {
                                const duration =
                                  (e.target as HTMLVideoElement).duration || 0;
                                setDurations((prev) => {
                                  const next = prev.slice();
                                  next[idx] = duration;
                                  return next;
                                });
                              }}
                              onPlay={() => activateIndex(idx)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <hr className="my-4 border-input" />
                <div className="text-sm text-zinc-300">
                  {stream?.description ?? ""}
                </div>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col">
              <CardContent className="pt-0  flex-1 h-0 flex flex-col">
                <h3 className="text-sm font-semibold mb-2">Cope Replay</h3>
                <div className="h-0 flex-1 max-h-[75vh] overflow-auto rounded-md border bg-muted/30 p-2">
                  {syncedMessages.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      No messages yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {syncedMessages.map((m) => (
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
                          <div className="text-xs text-slate-500">
                            {new Date(m.create_date).toLocaleTimeString()}
                          </div>
                          <div className="mt-0.5 text-slate-800">
                            {m.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
