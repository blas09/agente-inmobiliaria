import Link from "next/link";

import { CardBox } from "@/components/dashboard/card-box";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { SortableHeader } from "@/components/shared/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import {
  getFaqListStats,
  listFaqsPaginated,
  type FaqListSort,
} from "@/server/queries/faqs";
import { resolvePagination, resolveSort } from "@/lib/pagination";
import { canManageFaqs } from "@/lib/permissions";
import { getFaqStatusLabel } from "@/lib/ui-labels";

const faqSorts = [
  "created",
  "category",
  "status",
] as const satisfies readonly FaqListSort[];

export default async function FaqsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    sort?: string;
    direction?: string;
  }>;
}) {
  const params = await searchParams;
  const { activeTenant, activeMembership } = await getActiveTenantContext();
  const canManageTenantFaqs = canManageFaqs(activeMembership.role);
  const pagination = resolvePagination(params, 12);
  const sorting = resolveSort(params, faqSorts, {
    sort: "created",
    direction: "desc",
  });
  const [faqResult, faqStats] = await Promise.all([
    listFaqsPaginated(activeTenant.id, pagination, sorting),
    getFaqListStats(activeTenant.id),
  ]);
  const faqs = faqResult.items;
  const listParams = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    sort: sorting.sort,
    direction: sorting.direction,
  };

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title="FAQs"
        description="Respuestas base para sostener conversaciones consistentes con criterio comercial."
        action={
          canManageTenantFaqs ? (
            <Link href="/dashboard/faqs/new">
              <Button>Nueva FAQ</Button>
            </Link>
          ) : null
        }
      />
      <DashboardTopCards
        items={[
          {
            key: "total",
            label: "FAQs",
            value: faqResult.total,
            tone: "primary",
          },
          {
            key: "active",
            label: "Activas",
            value: faqStats.active,
            tone: "success",
          },
          {
            key: "inactive",
            label: "Inactivas",
            value: faqStats.total - faqStats.active,
            tone: "warning",
          },
        ]}
      />
      {faqs.length === 0 ? (
        <EmptyState
          title="Todavía no hay FAQs"
          description="Las respuestas base del tenant permiten cubrir preguntas frecuentes con criterio editorial."
          actionHref={canManageTenantFaqs ? "/dashboard/faqs/new" : undefined}
          actionLabel={canManageTenantFaqs ? "Crear FAQ" : undefined}
        />
      ) : (
        <div className="grid gap-4">
          <section className="flex flex-wrap gap-3 border-b pb-4 text-sm">
            <SortableHeader
              activeSort={sorting.sort}
              direction={sorting.direction}
              label="Creado"
              params={listParams}
              pathname="/dashboard/faqs"
              sortKey="created"
            />
            <SortableHeader
              activeSort={sorting.sort}
              direction={sorting.direction}
              label="Categoría"
              params={listParams}
              pathname="/dashboard/faqs"
              sortKey="category"
            />
            <SortableHeader
              activeSort={sorting.sort}
              direction={sorting.direction}
              label="Estado"
              params={listParams}
              pathname="/dashboard/faqs"
              sortKey="status"
            />
          </section>
          <CardBox className="overflow-hidden">
            <div className="divide-border divide-y">
              {faqs.map((faq) => {
                const content = (
                  <div className="grid gap-3 px-5 py-4 lg:grid-cols-[minmax(260px,0.9fr)_minmax(320px,1.2fr)_auto] lg:items-start">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{faq.question}</p>
                      <p className="text-muted-foreground mt-1 truncate text-sm">
                        {faq.category ?? "Sin categoría"}
                      </p>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-6">
                      {faq.answer}
                    </p>
                    <div className="flex lg:justify-end">
                      <Badge
                        className="w-fit"
                        variant={
                          faq.status === "active" ? "lightSuccess" : "outline"
                        }
                      >
                        {getFaqStatusLabel(faq.status)}
                      </Badge>
                    </div>
                  </div>
                );

                return canManageTenantFaqs ? (
                  <Link
                    className="hover:bg-lightprimary/15 block transition"
                    href={`/dashboard/faqs/${faq.id}/edit`}
                    key={faq.id}
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={faq.id}>{content}</div>
                );
              })}
            </div>
          </CardBox>
          <PaginationControls
            page={pagination.page}
            pageSize={pagination.pageSize}
            params={listParams}
            pathname="/dashboard/faqs"
            total={faqResult.total}
          />
        </div>
      )}
    </div>
  );
}
