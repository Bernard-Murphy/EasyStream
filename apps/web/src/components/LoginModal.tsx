'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { makeGqlClient } from '@/lib/graphql';
import { setToken } from '@/lib/auth';

export function LoginModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const show = searchParams.get('login') === 'true';

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('change_me');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const closeUrl = useMemo(() => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete('login');
    const qs = next.toString();
    return qs ? `/?${qs}` : '/';
  }, [searchParams]);

  useEffect(() => {
    if (!show) setError(null);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg">
        <div className="mb-4">
          <div className="text-lg font-semibold">Moderator Login</div>
          <div className="text-sm text-slate-600">
            Accounts are manually seeded. Use the seeded credentials in your env.
          </div>
        </div>

        <div className="space-y-3">
          <label className="block">
            <div className="mb-1 text-sm font-medium">Username</div>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="block">
            <div className="mb-1 text-sm font-medium">Password</div>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
            onClick={() => router.push(closeUrl)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-60"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              setError(null);
              try {
                const client = makeGqlClient();
                const res = await client.request<{
                  login: { token: string };
                }>(
                  `
                    mutation Login($u: String!, $p: String!) {
                      login(username: $u, password: $p) {
                        token
                      }
                    }
                  `,
                  { u: username, p: password },
                );
                setToken(res.login.token);
                router.push(closeUrl);
              } catch (e: any) {
                setError(e?.response?.errors?.[0]?.message ?? 'Login failed');
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}


