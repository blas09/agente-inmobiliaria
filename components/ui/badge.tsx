import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white",
        primary: "border-transparent bg-primary text-white",
        secondary: "border-transparent bg-secondary text-white",
        success: "border-transparent bg-success text-white",
        warning: "border-transparent bg-warning text-white",
        info: "border-transparent bg-info text-white",
        error: "border-transparent bg-error text-white",
        outline: "border-primary text-primary",
        outlineSecondary: "border-secondary text-secondary",
        outlineSuccess: "border-success text-success",
        outlineWarning: "border-warning text-warning",
        outlineError: "border-error text-error",
        outlineInfo: "border-info text-info",
        lightPrimary: "border-0 bg-lightprimary text-primary",
        lightSecondary: "border-0 bg-lightsecondary text-secondary",
        lightSuccess: "border-0 bg-lightsuccess text-success",
        lightError: "border-0 bg-lighterror text-error",
        lightInfo: "border-0 bg-lightinfo text-info",
        lightWarning: "border-0 bg-lightwarning text-warning",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        gray: "border-transparent bg-muted text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
