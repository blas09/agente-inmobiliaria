import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { buildSearchHref, getTotalPages } from "@/lib/pagination";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  pathname: string;
  params: Record<string, string | number | undefined | null>;
  page: number;
  pageSize: number;
  total: number;
}

export function PaginationControls({
  pathname,
  params,
  page,
  pageSize,
  total,
}: PaginationControlsProps) {
  const totalPages = getTotalPages(total, pageSize);
  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);
  const previousPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  return (
    <div className="flex flex-col gap-3 border-t pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground">
        {total === 0
          ? "Sin resultados"
          : `${firstItem}-${lastItem} de ${total} resultados`}
      </p>
      <div className="flex items-center gap-2">
        <Link
          aria-disabled={page <= 1}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            page <= 1 && "pointer-events-none opacity-50",
          )}
          href={buildSearchHref(pathname, params, { page: previousPage })}
        >
          Anterior
        </Link>
        <span className="text-muted-foreground px-2">
          Página {page} de {totalPages}
        </span>
        <Link
          aria-disabled={page >= totalPages}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            page >= totalPages && "pointer-events-none opacity-50",
          )}
          href={buildSearchHref(pathname, params, { page: nextPage })}
        >
          Siguiente
        </Link>
      </div>
    </div>
  );
}
