export type AssembleRequest = {
  streamUuid: string;
  clipUrls: string[];
  clipSizesMb: number[];
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


