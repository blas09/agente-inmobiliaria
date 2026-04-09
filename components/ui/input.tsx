import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex h-9 w-full rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 file:mr-5 file:rounded-sm file:border-0 file:text-sm file:font-medium file:text-primary focus-visible:outline-0",
  {
    variants: {
      variant: {
        default:
          "border-ld bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-0",
        gray: "border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus-visible:border-primary focus-visible:ring",
        info: "border-info bg-info/10 text-info placeholder:text-info/50 focus-visible:border-info focus-visible:ring",
        failure:
          "border-error bg-error/10 text-error placeholder:text-error/50 focus-visible:border-error focus-visible:ring",
        warning:
          "border-warning bg-warning/10 text-warning placeholder:text-warning/50 focus-visible:border-warning focus-visible:ring",
        success:
          "border-success bg-success/10 text-success placeholder:text-success/50 focus-visible:border-success focus-visible:ring",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface InputProps
  extends
    React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
