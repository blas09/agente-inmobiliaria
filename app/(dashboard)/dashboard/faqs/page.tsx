import Link from "next/link";

import { CardBox } from "@/components/dashboard/card-box";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { SortableHeader } from "@/components/shared/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
          {faqs.map((faq) => (
            <CardBox key={faq.id}>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    {canManageTenantFaqs ? (
                      <Link href={`/dashboard/faqs/${faq.id}/edit`}>
                        <CardTitle className="hover:text-primary text-base">
                          {faq.question}
                        </CardTitle>
                      </Link>
                    ) : (
                      <CardTitle className="text-base">
                        {faq.question}
                      </CardTitle>
                    )}
                    <CardDescription>
                      {faq.category ?? "Sin categoría"}
                    </CardDescription>
                  </div>
                  <Badge
                    className="w-fit"
                    variant={
                      faq.status === "active" ? "lightSuccess" : "outline"
                    }
                  >
                    {getFaqStatusLabel(faq.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-4 text-sm leading-6">
                  {faq.answer}
                </p>
              </CardContent>
            </CardBox>
          ))}
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
