import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { buildSearchHref, type SortDirection } from "@/lib/pagination";
import { cn } from "@/lib/utils";

interface SortableHeaderProps {
  pathname: string;
  params: Record<string, string | number | undefined | null>;
  label: string;
  sortKey: string;
  activeSort: string;
  direction: SortDirection;
  className?: string;
}

export function SortableHeader({
  pathname,
  params,
  label,
  sortKey,
  activeSort,
  direction,
  className,
}: SortableHeaderProps) {
  const isActive = activeSort === sortKey;
  const nextDirection = isActive && direction === "asc" ? "desc" : "asc";
  const Icon = isActive
    ? direction === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  return (
    <Link
      className={cn(
        "hover:text-primary inline-flex items-center gap-1.5",
        isActive && "text-primary",
        className,
      )}
      href={buildSearchHref(pathname, params, {
        sort: sortKey,
        direction: nextDirection,
        page: 1,
      })}
    >
      {label}
      <Icon aria-hidden className="size-3.5" />
    </Link>
  );
}
