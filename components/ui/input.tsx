"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-2xl border border-white/10 bg-magellan-delft/60 px-4 py-2 text-sm text-white caret-magellan-glaucous shadow-sm transition focus-visible:border-magellan-glaucous focus-visible:bg-magellan-delft focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 caret-animate",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
