'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

const inputClasses =
  'flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      className={cn(inputClasses, className)}
      ref={ref}
      {...props}
    />
  ),
);

Input.displayName = 'Input';

