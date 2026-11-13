import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[6px] border text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--star-primary)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "border-[var(--star-primary)] bg-[var(--star-primary)] text-[#111820] hover:bg-[#f6d998]",
        secondary: "border-[var(--line-strong)] text-[var(--star-primary)] hover:bg-[rgba(240,207,138,0.08)]",
        ghost: "border-transparent text-[var(--text-secondary)] hover:border-[var(--line-strong)] hover:text-[var(--text-primary)]",
      },
      size: {
        default: "h-10 px-4",
        icon: "h-9 w-9 p-0",
        compact: "h-8 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
