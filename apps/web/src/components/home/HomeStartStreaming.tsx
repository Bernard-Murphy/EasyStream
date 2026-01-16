"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  DialogClose,
} from "@/components/ui/dialog";
import BouncyClick from "@/components/ui/bouncy-click";
import Spinner from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import { fade_out, normalize, transition_fast } from "@/lib/transitions";
import { RadioTower } from "lucide-react";

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
  const DEFAULT_VIDEO_DEVICE = "default-camera";
  const DEFAULT_AUDIO_DEVICE = "default-microphone";

  const [videoDeviceId, setVideoDeviceId] =
    useState<string>(DEFAULT_VIDEO_DEVICE);
  const [audioDeviceId, setAudioDeviceId] =
    useState<string>(DEFAULT_AUDIO_DEVICE);
  const [deviceRefreshNonce, setDeviceRefreshNonce] = useState(0);

  const mediaConstraints = useMemo(() => {
    const normalizedVideoId =
      videoDeviceId === DEFAULT_VIDEO_DEVICE ? "" : videoDeviceId;
    const normalizedAudioId =
      audioDeviceId === DEFAULT_AUDIO_DEVICE ? "" : audioDeviceId;
    const video =
      enableVideo && normalizedVideoId
        ? ({ deviceId: { exact: normalizedVideoId } } as const)
        : enableVideo
          ? true
          : false;
    const audio =
      enableAudio && normalizedAudioId
        ? ({ deviceId: { exact: normalizedAudioId } } as const)
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
        if (
          (!videoDeviceId || videoDeviceId === DEFAULT_VIDEO_DEVICE) &&
          vids[0]?.deviceId
        )
          setVideoDeviceId(vids[0].deviceId);
        if (
          (!audioDeviceId || audioDeviceId === DEFAULT_AUDIO_DEVICE) &&
          auds[0]?.deviceId
        )
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

  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const resetDevicesAndPermissions = async () => {
    // Note: browsers don't allow programmatic permission revocation; this just re-requests
    // and refreshes the enumerated device list + selections.
    setDeviceLoading(true);
    try {
      setVideoDeviceId(DEFAULT_VIDEO_DEVICE);
      setAudioDeviceId(DEFAULT_AUDIO_DEVICE);
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

  useEffect(() => {
    if (!open) {
      previewStreamRef.current?.getTracks().forEach((t) => t.stop());
      previewStreamRef.current = null;
      setAudioLevel(0);
      return;
    }

    const videoConstraint =
      enableVideo && videoDeviceId !== DEFAULT_VIDEO_DEVICE
        ? ({ deviceId: { exact: videoDeviceId } } as const)
        : enableVideo
          ? true
          : false;
    const audioConstraint =
      enableAudio && audioDeviceId !== DEFAULT_AUDIO_DEVICE
        ? ({ deviceId: { exact: audioDeviceId } } as const)
        : enableAudio
          ? true
          : false;

    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    const levelData = new Uint8Array(32);
    let animationFrame: number | null = null;

    navigator.mediaDevices
      .getUserMedia({
        video: videoConstraint,
        audio: audioConstraint,
      })
      .then((stream) => {
        previewStreamRef.current?.getTracks().forEach((t) => t.stop());
        previewStreamRef.current = stream;
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = stream;
          previewVideoRef.current.play().catch(() => {
            /* Autoplay blocked; ignore. */
          });
        }

        if (enableAudio && audioConstraint) {
          audioCtx = new AudioContext();
          audioCtx.resume().catch(() => {
            /* ignore */
          });
          const source = audioCtx.createMediaStreamSource(stream);
          analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          const tick = () => {
            if (!analyser) return;
            analyser.getByteFrequencyData(levelData);
            const level =
              levelData.reduce((sum, value) => sum + value, 0) /
              levelData.length;
            setAudioLevel(level / 255);
            animationFrame = requestAnimationFrame(tick);
          };
          tick();
        } else {
          setAudioLevel(0);
        }
      })
      .catch(() => {
        setAudioLevel(0);
      });

    return () => {
      previewStreamRef.current?.getTracks().forEach((t) => t.stop());
      previewStreamRef.current = null;
      if (audioCtx) {
        audioCtx.close();
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [audioDeviceId, enableAudio, enableVideo, open, videoDeviceId]);

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
      } catch (e: unknown) {
        throw new Error(
          (e as { name?: string })?.name === "NotAllowedError"
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
    } catch (e: unknown) {
      setLoading(false);
      toast.warning(
        (e as { message?: string })?.message ??
          (e as { response?: { errors?: Array<{ message?: string }> } })
            ?.response?.errors?.[0]?.message ??
          "Failed to start stream"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BouncyClick className="w-full">
        <DialogTrigger asChild>
          <Button className="w-full">
            <RadioTower className="size-4 mr-2" />
            Go Live
          </Button>
        </DialogTrigger>
      </BouncyClick>

      <DialogContent className="sm:max-w-xl space-y-4 max-h-[100vh] overflow-auto">
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
            <AnimatePresence mode="wait">
              {deviceLoading ? (
                <motion.div
                  initial={fade_out}
                  animate={normalize}
                  exit={fade_out}
                  transition={transition_fast}
                  className="flex items-center gap-2 text-xs text-zinc-500"
                  key="loading"
                >
                  <Spinner size="sm" /> Loading devices…
                </motion.div>
              ) : (
                <BouncyClick key="reset">
                  <motion.button
                    initial={fade_out}
                    animate={normalize}
                    exit={fade_out}
                    transition={transition_fast}
                    type="button"
                    className="text-xs font-medium underline text-zinc-600 hover:text-zinc-400 cursor-pointer"
                    onClick={resetDevicesAndPermissions}
                    disabled={deviceLoading || loading}
                  >
                    Reset devices / permissions
                  </motion.button>
                </BouncyClick>
              )}
            </AnimatePresence>
          </div>

          {(enableVideo || enableAudio) && (
            <div className="space-y-3">
              {enableVideo ? (
                <div className="rounded-md border border-zinc-700 bg-black">
                  <div className="relative w-full">
                    <div className="pointer-events-none relative overflow-hidden rounded-md bg-black pb-[56.25%]">
                      <video
                        ref={previewVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
              {enableAudio ? (
                <div className="space-y-1">
                  <div className="text-xs text-zinc-400">Microphone level</div>
                  <div className="h-2 w-full rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-zinc-500 transition-all"
                      style={{ width: `${Math.min(100, audioLevel * 100)}%` }}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {enableVideo ? (
            <div className="grid gap-2">
              <Label>Camera</Label>
              <Select
                value={videoDeviceId}
                onValueChange={(value) => setVideoDeviceId(value)}
              >
                <SelectTrigger aria-label="Camera selection">
                  <SelectValue placeholder="Default camera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DEFAULT_VIDEO_DEVICE}>
                    Default camera
                  </SelectItem>
                  {videoInputs.map((d) => (
                    <SelectItem key={d.deviceId} value={d.deviceId}>
                      {d.label || "Camera"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {enableAudio ? (
            <div className="grid gap-2">
              <Label>Microphone</Label>
              <Select
                value={audioDeviceId}
                onValueChange={(value) => setAudioDeviceId(value)}
              >
                <SelectTrigger aria-label="Microphone selection">
                  <SelectValue placeholder="Default microphone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DEFAULT_AUDIO_DEVICE}>
                    Default microphone
                  </SelectItem>
                  {audioInputs.map((d) => (
                    <SelectItem key={d.deviceId} value={d.deviceId}>
                      {d.label || "Microphone"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        <DialogFooter className="justify-end mb-10 md:mb-0">
          <DialogClose asChild>
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
          </DialogClose>

          <BouncyClick disabled={loading}>
            <Button disabled={loading} size="sm" onClick={handleGoLive}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                </>
              ) : (
                "Start"
              )}
            </Button>
          </BouncyClick>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
