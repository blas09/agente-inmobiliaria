import Link from "next/link";
import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  actionHref,
  actionLabel,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl space-y-1">
        <h1 className="text-foreground text-[1.75rem] leading-tight font-semibold tracking-tight md:text-[2rem]">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground max-w-2xl text-sm leading-6">
            {description}
          </p>
        ) : null}
      </div>
      <div className="flex w-full flex-col gap-2.5 md:w-auto md:items-end">
        {children ? <div className="w-full md:w-auto">{children}</div> : null}
        {actionHref && actionLabel ? (
          <Link className={buttonVariants({ shape: "pill" })} href={actionHref}>
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
