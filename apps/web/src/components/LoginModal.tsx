'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { makeGqlClient } from '@/lib/graphql';
import { getToken, setToken } from '@/lib/auth';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginModal() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const show = searchParams.get('login') === 'true' && !getToken();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('change_me');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const closeUrl = useMemo(() => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete('login');
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!show) setError(null);
  }, [show]);

  useEffect(() => {
    // If user is already logged in and they hit a ?login=true URL, quietly remove it.
    if (searchParams.get('login') === 'true' && getToken()) {
      router.replace(closeUrl);
    }
  }, [closeUrl, router, searchParams]);

  const closeModal = () => {
    router.push(closeUrl);
  };

  if (!show) return null;

  return (
    <Dialog open onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle>Moderator Login</DialogTitle>
          <DialogDescription>
            Accounts are manually seeded. Use the seeded credentials in your env.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="moderator-username">Username</Label>
            <Input
              id="moderator-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="moderator-password">Password</Label>
            <Input
              id="moderator-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" size="sm" onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
          <Button
            size="sm"
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
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Login'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


