import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

// Lavish Cinemas button primitive. Variants map to the brand's actual
// tokens (gold / black / surface / muted) rather than generic shadcn
// semantic names, since this project has no primary/secondary/background
// theme layer, just the fixed palette from the brand style guide.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center cursor-pointer rounded-pill border border-transparent bg-clip-padding font-mono text-[11px] uppercase tracking-[0.15em] whitespace-nowrap transition-all outline-none select-none focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-gold text-black hover:bg-white",
        outline: "border-gold text-gold bg-transparent hover:bg-gold-dim",
        secondary: "bg-surface text-white border-border hover:bg-white/5",
        ghost: "text-muted border-transparent hover:bg-white/5 hover:text-white",
        destructive: "bg-red-500/10 text-red-400 border-transparent hover:bg-red-500/20",
        link: "text-gold underline-offset-4 hover:underline border-transparent bg-transparent"
      },
      size: {
        default: "h-11 gap-sm px-lg",
        sm: "h-9 gap-xs px-md text-[10px]",
        lg: "h-14 gap-sm px-xl",
        icon: "size-11",
        "icon-sm": "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
