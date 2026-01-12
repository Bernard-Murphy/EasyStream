export type AnonSession = {
  anon_id: string;
  anon_text_color: string;
  anon_background_color: string;
  name?: string;
};

const KEY = 'easystream:anonSession';

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getOrCreateAnonSession(): AnonSession {
  if (typeof window === 'undefined') {
    return {
      anon_id: 'anon-server',
      anon_text_color: '#111827',
      anon_background_color: '#dbeafe',
    };
  }

  const raw = window.localStorage.getItem(KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as AnonSession;
    } catch {
      // fallthrough
    }
  }

  const textColors = ['#111827', '#1f2937', '#0f172a', '#172554', '#3f1d0b'];
  const bgColors = ['#fef3c7', '#dbeafe', '#dcfce7', '#fce7f3', '#e0e7ff'];

  const session: AnonSession = {
    anon_id: `anon-${crypto.randomUUID().slice(0, 8)}`,
    anon_text_color: randomFrom(textColors),
    anon_background_color: randomFrom(bgColors),
  };
  window.localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function setAnonName(name: string) {
  const s = getOrCreateAnonSession();
  const next = { ...s, name };
  window.localStorage.setItem(KEY, JSON.stringify(next));
}


