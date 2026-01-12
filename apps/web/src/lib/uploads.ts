import { CONFIG } from './config';

export async function uploadBlob(params: {
  url: string;
  file: Blob;
  filename: string;
  contentType?: string;
}): Promise<{ url: string; key: string }> {
  const form = new FormData();
  form.append('file', params.file, params.filename);

  const res = await fetch(params.url, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Upload failed (${res.status}): ${txt}`);
  }
  return (await res.json()) as { url: string; key: string };
}

export function clipUploadUrl(streamUuid: string) {
  return `${CONFIG.restUrl}/upload/clip?streamUuid=${encodeURIComponent(streamUuid)}`;
}

export function thumbnailUploadUrl(streamUuid: string) {
  return `${CONFIG.restUrl}/upload/thumbnail?streamUuid=${encodeURIComponent(streamUuid)}`;
}


