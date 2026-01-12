'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(
        'rounded-2xl border border-slate-100 bg-white shadow-sm transition-colors',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn('flex flex-col space-y-1.5 border-b border-slate-100 px-5 pt-5', className)}
      ref={ref}
      {...props}
    />
  ),
);

CardHeader.displayName = 'CardHeader';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn('px-5 py-4', className)} ref={ref} {...props} />
  ),
);

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 border-t border-slate-100 px-5 py-4',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

CardFooter.displayName = 'CardFooter';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      className={cn('text-lg font-semibold leading-tight text-slate-900', className)}
      ref={ref}
      {...props}
    />
  ),
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p className={cn('text-sm text-slate-500', className)} ref={ref} {...props} />
  ),
);

CardDescription.displayName = 'CardDescription';

