import { CONFIG } from './config';

export async function uploadBlob(params: {
  url: string;
  file: Blob;
  filename: string;
  contentType?: string;
  hostToken?: string | null;
}): Promise<{ url: string; key: string }> {
  const form = new FormData();
  form.append('file', params.file, params.filename);

  const res = await fetch(params.url, {
    method: 'POST',
    headers: params.hostToken ? { 'x-host-token': params.hostToken } : undefined,
    body: form,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Upload failed (${res.status}): ${txt}`);
  }
  return (await res.json()) as { url: string; key: string };
}

export function clipUploadUrl(streamUuid: string) {
  const qs = new URLSearchParams({
    streamUuid,
  });
  return `${CONFIG.restUrl}/upload/clip?${qs.toString()}`;
}

export function thumbnailUploadUrl(streamUuid: string) {
  const qs = new URLSearchParams({
    streamUuid,
  });
  return `${CONFIG.restUrl}/upload/thumbnail?${qs.toString()}`;
}


