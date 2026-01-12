/**
 * EasyStream Lambda - Assemble uploaded clips into larger stream files.
 *
 * This is a scaffold. The real implementation should:
 * - Download clips from Storj (S3 compatible)
 * - Concatenate them in order (ffmpeg recommended) into parts of max STREAM_LENGTH_MB
 * - Upload assembled parts back to Storj
 * - Delete original clips
 *
 * For now, we only compute the grouping plan and return it.
 */

export type AssembleRequest = {
  streamUuid: string;
  clipUrls: string[];
  clipSizesMb: number[]; // parallel to clipUrls
  streamLengthMb: number;
};

export type AssemblePlan = {
  streamUuid: string;
  groups: Array<{
    partIndex: number;
    clipUrls: string[];
    totalMb: number;
  }>;
};

export function buildAssemblePlan(req: AssembleRequest): AssemblePlan {
  const groups: AssemblePlan['groups'] = [];
  let current: string[] = [];
  let total = 0;
  let partIndex = 0;

  for (let i = 0; i < req.clipUrls.length; i++) {
    const url = req.clipUrls[i];
    const mb = req.clipSizesMb[i] ?? 0;

    if (current.length > 0 && total + mb > req.streamLengthMb) {
      groups.push({ partIndex, clipUrls: current, totalMb: total });
      partIndex += 1;
      current = [];
      total = 0;
    }

    current.push(url);
    total += mb;
  }

  if (current.length > 0) {
    groups.push({ partIndex, clipUrls: current, totalMb: total });
  }

  return { streamUuid: req.streamUuid, groups };
}

// AWS Lambda handler
export async function handler(event: AssembleRequest): Promise<AssemblePlan> {
  return buildAssemblePlan(event);
}


