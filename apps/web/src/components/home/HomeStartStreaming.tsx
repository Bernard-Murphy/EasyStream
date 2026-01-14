"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { makeGqlClient } from "@/lib/graphql";
import { getOrCreateAnonSession } from "@/lib/anonSession";
import { thumbnailUploadUrl, uploadBlob } from "@/lib/uploads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  // DialogClose
} from "@/components/ui/dialog";
import BouncyClick from "@/components/ui/bouncy-click";
import Spinner from "@/components/ui/spinner";

export function HomeStartStreaming() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [deviceLoading, setDeviceLoading] = useState(false);
  const [videoInputs, setVideoInputs] = useState<MediaDeviceInfo[]>([]);
  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);
  const [enableVideo, setEnableVideo] = useState(true);
  const [enableAudio, setEnableAudio] = useState(true);
  const [videoDeviceId, setVideoDeviceId] = useState<string>("");
  const [audioDeviceId, setAudioDeviceId] = useState<string>("");
  const [deviceRefreshNonce, setDeviceRefreshNonce] = useState(0);

  const mediaConstraints = useMemo(() => {
    const video =
      enableVideo && videoDeviceId
        ? ({ deviceId: { exact: videoDeviceId } } as const)
        : enableVideo
          ? true
          : false;
    const audio =
      enableAudio && audioDeviceId
        ? ({ deviceId: { exact: audioDeviceId } } as const)
        : enableAudio
          ? true
          : false;
    return { video, audio };
  }, [audioDeviceId, enableAudio, enableVideo, videoDeviceId]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    async function loadDevices() {
      setDeviceLoading(true);
      try {
        // Request permissions so device labels are available.
        const tmp = await navigator.mediaDevices.getUserMedia({
          video: enableVideo,
          audio: enableAudio,
        });
        tmp.getTracks().forEach((t) => t.stop());

        const devices = await navigator.mediaDevices.enumerateDevices();
        if (cancelled) return;
        const vids = devices.filter((d) => d.kind === "videoinput");
        const auds = devices.filter((d) => d.kind === "audioinput");
        setVideoInputs(vids);
        setAudioInputs(auds);
        if (!videoDeviceId && vids[0]?.deviceId)
          setVideoDeviceId(vids[0].deviceId);
        if (!audioDeviceId && auds[0]?.deviceId)
          setAudioDeviceId(auds[0].deviceId);
      } catch {
        // If user denies permission, they can still attempt to proceed; /live will surface errors.
      } finally {
        if (!cancelled) setDeviceLoading(false);
      }
    }

    loadDevices();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, deviceRefreshNonce]);

  const resetDevicesAndPermissions = async () => {
    // Note: browsers don't allow programmatic permission revocation; this just re-requests
    // and refreshes the enumerated device list + selections.
    setDeviceLoading(true);
    try {
      setVideoDeviceId("");
      setAudioDeviceId("");
      setVideoInputs([]);
      setAudioInputs([]);
      try {
        const tmp = await navigator.mediaDevices.getUserMedia({
          video: enableVideo,
          audio: enableAudio,
        });
        tmp.getTracks().forEach((t) => t.stop());
        toast.info("Device access refreshed");
      } catch {
        toast.warning(
          "Could not refresh device permissions. Check your browser site settings."
        );
      }
    } finally {
      setDeviceRefreshNonce((n) => n + 1);
      setDeviceLoading(false);
    }
  };

  const handleGoLive = async () => {
    setLoading(true);
    try {
      if (typeof window === "undefined") return;
      if (!("RTCPeerConnection" in window)) {
        throw new Error("This browser does not support WebRTC.");
      }
      if (!("MediaRecorder" in window)) {
        throw new Error(
          "This browser cannot record streams (MediaRecorder missing)."
        );
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("This browser cannot access media devices.");
      }
      if (!enableVideo && !enableAudio) {
        throw new Error("Enable video and/or audio to start streaming.");
      }

      // Preflight permissions + constraints now so errors happen on the home page.
      try {
        const test =
          await navigator.mediaDevices.getUserMedia(mediaConstraints);
        test.getTracks().forEach((t) => t.stop());
      } catch (e: any) {
        throw new Error(
          e?.name === "NotAllowedError"
            ? "Camera/mic permission denied."
            : "Failed to access selected devices."
        );
      }

      const anon = getOrCreateAnonSession();
      const client = makeGqlClient();
      const res = await client.request<{
        createStreamWithHostToken: {
          stream: { uuid: string };
          hostToken: string;
        };
      }>(
        `
          mutation CreateStreamWithHostToken(
            $title: String!
            $description: String!
            $anon_id: String
            $anon_text_color: String
            $anon_background_color: String
          ) {
            createStreamWithHostToken(
              title: $title
              description: $description
              anon_id: $anon_id
              anon_text_color: $anon_text_color
              anon_background_color: $anon_background_color
            ) {
              stream { uuid }
              hostToken
            }
          }
        `,
        {
          title: title.trim() || "Untitled Stream",
          description: description.trim() || "No description",
          anon_id: anon.anon_id,
          anon_text_color: anon.anon_text_color,
          anon_background_color: anon.anon_background_color,
        }
      );
      const uuid = res.createStreamWithHostToken.stream.uuid;
      const hostToken = res.createStreamWithHostToken.hostToken;

      // Mark this browser as the host for this stream (used by /live/:id)
      window.localStorage.setItem(`easystream:host:${uuid}`, "true");
      window.localStorage.setItem(`easystream:hostToken:${uuid}`, hostToken);

      // Persist selected constraints for /live/:id host startup.
      window.localStorage.setItem(
        `easystream:hostMedia:${uuid}`,
        JSON.stringify(mediaConstraints)
      );

      // Best-effort: capture a thumbnail (if video enabled) and set it on the stream
      if (enableVideo) {
        try {
          const media = await navigator.mediaDevices.getUserMedia({
            video: mediaConstraints.video,
            audio: false,
          });
          const video = document.createElement("video");
          video.srcObject = media;
          video.muted = true;
          await video.play();
          await new Promise((r) => setTimeout(r, 250));

          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          const ctx = canvas.getContext("2d");
          if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const blob: Blob | null = await new Promise((resolve) =>
            canvas.toBlob((b) => resolve(b), "image/jpeg", 0.85)
          );

          media.getTracks().forEach((t) => t.stop());

          if (blob) {
            const up = await uploadBlob({
              url: thumbnailUploadUrl(uuid),
              file: blob,
              filename: "thumbnail.jpg",
              contentType: "image/jpeg",
            });
            await client.request(
              `mutation($uuid:String!,$thumbnailUrl:String!){setStreamThumbnail(uuid:$uuid,thumbnailUrl:$thumbnailUrl){uuid}}`,
              { uuid, thumbnailUrl: up.url }
            );
          }
        } catch {
          // ignore thumbnail failures for MVP
        }
      }

      router.push(`/live/${uuid}`);
    } catch (e: any) {
      toast.warning(
        e?.message ??
          e?.response?.errors?.[0]?.message ??
          "Failed to start stream"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
    // open={open} onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="w-full">Start Streaming Now</Button>
      </DialogTrigger>
      <DialogContent className="p-0 sm:max-w-xl space-y-4">
        <DialogHeader>
          <DialogTitle>Start a new stream</DialogTitle>
          <DialogDescription>
            Select your devices, enter details, then go live.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={enableVideo}
                onChange={(e) => setEnableVideo(e.target.checked)}
              />
              Video
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={enableAudio}
                onChange={(e) => setEnableAudio(e.target.checked)}
              />
              Audio
            </label>
            {deviceLoading ? (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Spinner size="sm" /> Loading devices…
              </div>
            ) : null}
            <button
              type="button"
              className="text-xs font-medium underline text-slate-700 hover:text-slate-900"
              onClick={resetDevicesAndPermissions}
              disabled={deviceLoading || loading}
            >
              Reset devices / permissions
            </button>
          </div>

          {enableVideo ? (
            <div className="grid gap-2">
              <Label>Camera</Label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={videoDeviceId}
                onChange={(e) => setVideoDeviceId(e.target.value)}
              >
                {videoInputs.length === 0 ? (
                  <option value="">Default camera</option>
                ) : (
                  videoInputs.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || "Camera"}
                    </option>
                  ))
                )}
              </select>
            </div>
          ) : null}

          {enableAudio ? (
            <div className="grid gap-2">
              <Label>Microphone</Label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={audioDeviceId}
                onChange={(e) => setAudioDeviceId(e.target.value)}
              >
                {audioInputs.length === 0 ? (
                  <option value="">Default microphone</option>
                ) : (
                  audioInputs.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || "Microphone"}
                    </option>
                  ))
                )}
              </select>
            </div>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stream-title">Title</Label>
          <Input
            id="stream-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My stream title"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stream-description">Description</Label>
          <Textarea
            id="stream-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this stream about?"
          />
        </div>
        <DialogFooter className="justify-end">
          <BouncyClick>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </BouncyClick>
          <BouncyClick disabled={loading}>
            <Button disabled={loading} size="sm" onClick={handleGoLive}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="ml-2">Starting…</span>
                </>
              ) : (
                "Go Live"
              )}
            </Button>
          </BouncyClick>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
