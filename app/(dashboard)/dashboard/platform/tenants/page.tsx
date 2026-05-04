import Link from "next/link";

import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { EmptyState } from "@/components/shared/empty-state";
import { MetricCard } from "@/components/shared/metric-card";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { SortableHeader } from "@/components/shared/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requirePlatformAdmin } from "@/server/auth/tenant-context";
import {
  getPlatformSummary,
  listAllTenantsPaginated,
  type PlatformTenantListSort,
} from "@/server/queries/tenants";
import { resolvePagination, resolveSort } from "@/lib/pagination";
import { getTenantStatusLabel } from "@/lib/ui-labels";

const platformTenantSorts = [
  "created",
  "name",
  "slug",
  "status",
  "timezone",
] as const satisfies readonly PlatformTenantListSort[];

export default async function PlatformTenantsPage({
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
  await requirePlatformAdmin();
  const pagination = resolvePagination(params, 20);
  const sorting = resolveSort(params, platformTenantSorts, {
    sort: "created",
    direction: "desc",
  });
  const [tenantResult, platformSummary] = await Promise.all([
    listAllTenantsPaginated(pagination, sorting),
    getPlatformSummary(),
  ]);
  const tenants = tenantResult.items;
  const listParams = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    sort: sorting.sort,
    direction: sorting.direction,
  };

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title="Tenants"
        description="Administración de workspaces de plataforma, estado operativo y configuración base."
        action={
          <Link href="/dashboard/platform/tenants/new">
            <Button>Nuevo tenant</Button>
          </Link>
        }
      />
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Tenants" tone="primary" value={tenantResult.total} />
        <MetricCard
          label="Activos"
          tone="success"
          value={platformSummary.activeTenants}
        />
        <MetricCard
          label="No activos"
          tone="warning"
          value={platformSummary.totalTenants - platformSummary.activeTenants}
        />
      </section>
      {tenants.length === 0 ? (
        <EmptyState
          title="Todavía no hay tenants"
          description="Creá la primera inmobiliaria para empezar a operar la plataforma con aislamiento real."
          actionHref="/dashboard/platform/tenants/new"
          actionLabel="Crear tenant"
        />
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortableHeader
                      activeSort={sorting.sort}
                      direction={sorting.direction}
                      label="Tenant"
                      params={listParams}
                      pathname="/dashboard/platform/tenants"
                      sortKey="name"
                    />
                  </TableHead>
                  <TableHead>
                    <SortableHeader
                      activeSort={sorting.sort}
                      direction={sorting.direction}
                      label="Slug"
                      params={listParams}
                      pathname="/dashboard/platform/tenants"
                      sortKey="slug"
                    />
                  </TableHead>
                  <TableHead>Moneda</TableHead>
                  <TableHead>
                    <SortableHeader
                      activeSort={sorting.sort}
                      direction={sorting.direction}
                      label="Timezone"
                      params={listParams}
                      pathname="/dashboard/platform/tenants"
                      sortKey="timezone"
                    />
                  </TableHead>
                  <TableHead>
                    <SortableHeader
                      activeSort={sorting.sort}
                      direction={sorting.direction}
                      label="Estado"
                      params={listParams}
                      pathname="/dashboard/platform/tenants"
                      sortKey="status"
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="min-w-[220px]">
                      <Link
                        className="text-foreground hover:text-primary font-medium"
                        href={`/dashboard/platform/tenants/${tenant.id}/edit`}
                      >
                        {tenant.name}
                      </Link>
                    </TableCell>
                    <TableCell>{tenant.slug}</TableCell>
                    <TableCell>{tenant.primary_currency}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {tenant.timezone}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tenant.status === "active"
                            ? "lightSuccess"
                            : "outline"
                        }
                      >
                        {getTenantStatusLabel(tenant.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="px-6 pb-5">
              <PaginationControls
                page={pagination.page}
                pageSize={pagination.pageSize}
                params={listParams}
                pathname="/dashboard/platform/tenants"
                total={tenantResult.total}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
