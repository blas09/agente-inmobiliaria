import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  description,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2.5", className)}>
      <label className="text-foreground text-sm font-medium" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {description ? (
        <p className="text-muted-foreground text-xs leading-5">{description}</p>
      ) : null}
      {error ? (
        <p className="text-destructive text-xs font-medium">{error}</p>
      ) : null}
    </div>
  );
}
