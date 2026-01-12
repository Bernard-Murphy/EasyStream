'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { makeGqlClient } from '@/lib/graphql';
import { getOrCreateAnonSession } from '@/lib/anonSession';
import { thumbnailUploadUrl, uploadBlob } from '@/lib/uploads';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function HomeStartStreaming() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full max-w-xl">
      {!open ? (
        <Button className="w-full" onClick={() => setOpen(true)}>
          Start Streaming Now
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Start a new stream</CardTitle>
            <CardDescription>
              MVP scaffold: device selection + thumbnail capture will be added next.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}
          </CardContent>
          <CardFooter className="justify-end">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={async () => {
                setLoading(true);
                setError(null);
                try {
                  const anon = getOrCreateAnonSession();
                  const client = makeGqlClient();
                  const res = await client.request<{
                    createStream: { uuid: string };
                  }>(
                    `
                      mutation CreateStream(
                        $title: String!
                        $description: String!
                        $anon_id: String
                        $anon_text_color: String
                        $anon_background_color: String
                      ) {
                        createStream(
                          title: $title
                          description: $description
                          anon_id: $anon_id
                          anon_text_color: $anon_text_color
                          anon_background_color: $anon_background_color
                        ) {
                          uuid
                        }
                      }
                    `,
                    {
                      title: title.trim() || 'Untitled Stream',
                      description: description.trim() || 'No description',
                      anon_id: anon.anon_id,
                      anon_text_color: anon.anon_text_color,
                      anon_background_color: anon.anon_background_color,
                    },
                  );
                  const uuid = res.createStream.uuid;

                  // Mark this browser as the host for this stream (used by /live/:id)
                  window.localStorage.setItem(`easystream:host:${uuid}`, 'true');

                  // Best-effort: capture a thumbnail (if camera is available) and set it on the stream
                  try {
                    const media = await navigator.mediaDevices.getUserMedia({
                      video: true,
                      audio: false,
                    });
                    const video = document.createElement('video');
                    video.srcObject = media;
                    video.muted = true;
                    await video.play();
                    await new Promise((r) => setTimeout(r, 250));

                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth || 640;
                    canvas.height = video.videoHeight || 360;
                    const ctx = canvas.getContext('2d');
                    if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    const blob: Blob | null = await new Promise((resolve) =>
                      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.85),
                    );

                    media.getTracks().forEach((t) => t.stop());

                    if (blob) {
                      const up = await uploadBlob({
                        url: thumbnailUploadUrl(uuid),
                        file: blob,
                        filename: 'thumbnail.jpg',
                        contentType: 'image/jpeg',
                      });
                      await client.request(
                        `mutation($uuid:String!,$thumbnailUrl:String!){setStreamThumbnail(uuid:$uuid,thumbnailUrl:$thumbnailUrl){uuid}}`,
                        { uuid, thumbnailUrl: up.url },
                      );
                    }
                  } catch {
                    // ignore thumbnail failures for MVP
                  }

                  router.push(`/live/${uuid}`);
                } catch (e: any) {
                  setError(e?.response?.errors?.[0]?.message ?? 'Failed to start stream');
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? 'Starting…' : 'Go Live'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}


