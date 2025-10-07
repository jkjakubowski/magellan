import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magellan-glaucous",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-magellan-glaucous/90 text-white hover:bg-magellan-glaucous",
        secondary:
          "border border-white/10 bg-magellan-delft/80 text-white/80 hover:bg-magellan-delft",
        outline: "border border-white/30 bg-transparent text-white"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
