"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-2xl border border-white/10 bg-magellan-delft/60 px-4 py-3 text-sm text-white caret-magellan-glaucous shadow-sm transition focus-visible:border-magellan-glaucous focus-visible:bg-magellan-delft focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 caret-animate",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
