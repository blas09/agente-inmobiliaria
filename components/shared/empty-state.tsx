import Link from "next/link";
import type { ReactNode } from "react";
import { CircleHelp, SearchX } from "lucide-react";

import { CardBox } from "@/components/dashboard/card-box";
import { buttonVariants } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  description: string;
  footer?: ReactNode;
  actionHref?: string;
  actionLabel?: string;
  tone?: "default" | "search";
}

export function EmptyState({
  title,
  description,
  footer,
  actionHref,
  actionLabel,
  tone = "default",
}: EmptyStateProps) {
  const Icon = tone === "search" ? SearchX : CircleHelp;

  return (
    <CardBox className="border-dashed">
      <CardHeader className="space-y-3">
        <div className="bg-lightprimary text-primary flex h-11 w-11 items-center justify-center rounded-lg text-sm font-semibold">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {footer || (actionHref && actionLabel) ? (
        <CardContent className="flex flex-wrap items-center gap-3">
          {footer}
          {actionHref && actionLabel ? (
            <Link
              className={buttonVariants({ variant: "lightprimary" })}
              href={actionHref}
            >
              {actionLabel}
            </Link>
          ) : null}
        </CardContent>
      ) : null}
    </CardBox>
  );
}
