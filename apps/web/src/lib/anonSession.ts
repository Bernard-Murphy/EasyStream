export type AnonSession = {
  anon_id: string;
  anon_text_color: string;
  anon_background_color: string;
  name?: string;
};

const KEY = 'easystream:anonSession';

function randomRgb(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
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

  const session: AnonSession = {
    anon_id: `anon-${crypto.randomUUID().slice(0, 8)}`,
    anon_text_color: randomRgb(),
    anon_background_color: randomRgb(),
  };
  window.localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function setAnonName(name: string) {
  const s = getOrCreateAnonSession();
  const next = { ...s, name };
  window.localStorage.setItem(KEY, JSON.stringify(next));
}


