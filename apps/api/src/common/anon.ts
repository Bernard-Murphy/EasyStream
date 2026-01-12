import { randomUUID } from 'crypto';

const TEXT_COLORS = [
  '#111827', // slate-900
  '#1f2937', // gray-800
  '#0f172a', // slate-950
  '#172554', // blue-950
  '#3f1d0b', // amber-950-ish
];

const BG_COLORS = [
  '#fef3c7', // amber-100
  '#dbeafe', // blue-100
  '#dcfce7', // green-100
  '#fce7f3', // pink-100
  '#e0e7ff', // indigo-100
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function createAnonSession() {
  const uuid = randomUUID().slice(0, 8);
  return {
    anon_id: `anon-${uuid}`,
    anon_text_color: pick(TEXT_COLORS),
    anon_background_color: pick(BG_COLORS),
  };
}


