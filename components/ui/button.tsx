"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magellan-glaucous focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-magellan-smoky",
  {
    variants: {
      variant: {
        default:
          "bg-magellan-glaucous text-sm font-semibold text-white shadow hover:opacity-90",
        secondary:
          "bg-magellan-delft text-white shadow hover:bg-magellan-delft/80",
        ghost: "hover:bg-white/10 hover:text-white",
        outline:
          "border border-magellan-glaucous/60 text-magellan-glaucous hover:bg-magellan-glaucous/10",
        link: "text-magellan-glaucous underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-xl px-3 text-sm",
        lg: "h-11 rounded-2xl px-6 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
