import Link from "next/link";

import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { EmptyState } from "@/components/shared/empty-state";
import { MetricCard } from "@/components/shared/metric-card";
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
import { listAllTenants } from "@/server/queries/tenants";
import { getTenantStatusLabel } from "@/lib/ui-labels";

export default async function PlatformTenantsPage() {
  await requirePlatformAdmin();
  const tenants = await listAllTenants();
  const activeTenants = tenants.filter(
    (tenant) => tenant.status === "active",
  ).length;

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
        <MetricCard label="Tenants" tone="primary" value={tenants.length} />
        <MetricCard label="Activos" tone="success" value={activeTenants} />
        <MetricCard
          label="No activos"
          tone="warning"
          value={tenants.length - activeTenants}
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
                  <TableHead>Tenant</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Moneda</TableHead>
                  <TableHead>Timezone</TableHead>
                  <TableHead>Estado</TableHead>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
