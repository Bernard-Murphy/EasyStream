'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { getToken, clearToken } from '@/lib/auth';
import { useEffect, useState } from 'react';

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      className={`text-sm font-medium ${
        active ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
      }`}
      href={href}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const searchParams = useSearchParams();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, [searchParams]);

  return (
    <div className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          EasyStream
        </Link>
        <div className="flex items-center gap-5">
          <NavLink href="/browse-live" label="Live Now" />
          <NavLink href="/browse-past" label="Past Streams" />
          {loggedIn ? (
            <button
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50"
              onClick={() => {
                clearToken();
                setLoggedIn(false);
              }}
            >
              Logout
            </button>
          ) : (
            <Link
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50"
              href="/?login=true"
            >
              Moderator Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}


