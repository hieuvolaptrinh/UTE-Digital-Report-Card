// components/ui/glass-card.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const glassCardVariants = cva(
  "rounded-lg backdrop-blur-[6px] border transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-white/12 dark:bg-black/15 border-white/18 dark:border-white/8 shadow-[0_6px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.3)]",
        elevated:
          "bg-white/15 dark:bg-black/18 border-white/20 dark:border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]",
        subtle:
          "bg-white/8 dark:bg-black/10 border-white/12 dark:border-white/6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)]",
      },
      padding: {
        none: "p-0",
        sm: "p-3 sm:p-4",
        md: "p-4 sm:p-6",
        lg: "p-6 sm:p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  hover?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, padding, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          glassCardVariants({ variant, padding }),
          hover &&
            "hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:-translate-y-0.5",
          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard, glassCardVariants };
