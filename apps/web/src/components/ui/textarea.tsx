"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const textareaClasses =
  "w-full rounded-md border border-zinc-800 bg-transparent px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600 ring-offset-zinc-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea className={cn(textareaClasses, className)} ref={ref} {...props} />
  )
);

Textarea.displayName = "Textarea";
