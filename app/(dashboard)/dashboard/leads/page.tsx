import Link from "next/link";

import { CardBox } from "@/components/dashboard/card-box";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterCard } from "@/components/shared/filter-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { listLeads } from "@/server/queries/leads";
import { formatDateTime } from "@/lib/utils";
import { canManageLeads } from "@/lib/permissions";
import {
  getLeadQualificationStatusLabel,
  getLeadSourceLabel,
  leadQualificationStatusLabels,
} from "@/lib/ui-labels";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const { activeTenant, activeMembership } = await getActiveTenantContext();
  const canManageLeadRecords = canManageLeads(activeMembership.role);
  const leads = await listLeads(activeTenant.id, params);
  const hasActiveFilters = Boolean(
    params.q || (params.status && params.status !== "all"),
  );
  const qualifiedCount = leads.filter(
    (lead) => lead.qualification_status === "qualified",
  ).length;
  const newCount = leads.filter(
    (lead) => lead.qualification_status === "new",
  ).length;

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title="Leads"
        description="Contactos comerciales que se califican, asignan y conectan con conversaciones y visitas."
        action={
          canManageLeadRecords ? (
            <Link href="/dashboard/leads/new">
              <Button>Nuevo lead</Button>
            </Link>
          ) : null
        }
      />
      <DashboardTopCards
        items={[
          {
            key: "total",
            label: "Total leads",
            value: leads.length,
            tone: "primary",
          },
          { key: "new", label: "Nuevos", value: newCount, tone: "warning" },
          {
            key: "qualified",
            label: "Calificados",
            value: qualifiedCount,
            tone: "success",
          },
        ]}
      />
      <FilterCard>
        <form
          className="grid gap-4 lg:grid-cols-[1fr_240px_auto_auto]"
          method="get"
        >
          <Input
            aria-label="Buscar leads"
            defaultValue={params.q ?? ""}
            name="q"
            placeholder="Buscar por nombre, email o teléfono"
          />
          <NativeSelect
            aria-label="Filtrar por estado comercial"
            defaultValue={params.status ?? "all"}
            name="status"
          >
            <option value="all">Todos los estados</option>
            {Object.entries(leadQualificationStatusLabels).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </NativeSelect>
          <Button type="submit" variant="lightprimary">
            Aplicar
          </Button>
          {hasActiveFilters ? (
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/dashboard/leads"
            >
              Limpiar
            </Link>
          ) : null}
        </form>
      </FilterCard>
      {leads.length === 0 ? (
        <EmptyState
          title={
            hasActiveFilters
              ? "Sin leads para este filtro"
              : "No hay leads todavía"
          }
          description={
            hasActiveFilters
              ? "Probá limpiar los filtros o buscar por otro contacto, fuente o estado."
              : "Podés cargarlos manualmente o dejar lista la estructura para WhatsApp y otros canales."
          }
          actionHref={
            hasActiveFilters
              ? "/dashboard/leads"
              : canManageLeadRecords
                ? "/dashboard/leads/new"
                : undefined
          }
          actionLabel={
            hasActiveFilters
              ? "Limpiar filtros"
              : canManageLeadRecords
                ? "Crear lead"
                : undefined
          }
        />
      ) : (
        <CardBox className="overflow-hidden">
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6">Lead</TableHead>
                  <TableHead>Fuente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="pr-6">Creado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="min-w-[260px] px-6 py-5">
                      <Link
                        className="text-foreground hover:text-primary font-semibold"
                        href={`/dashboard/leads/${lead.id}`}
                      >
                        {lead.full_name}
                      </Link>
                      <p className="text-muted-foreground text-xs">
                        {lead.email ?? lead.phone ?? "Sin contacto"}
                      </p>
                    </TableCell>
                    <TableCell>{getLeadSourceLabel(lead.source)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          lead.qualification_status === "qualified"
                            ? "lightSuccess"
                            : "outline"
                        }
                      >
                        {getLeadQualificationStatusLabel(
                          lead.qualification_status,
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{lead.score ?? "-"}</TableCell>
                    <TableCell className="pr-6 whitespace-nowrap">
                      {formatDateTime(lead.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </CardBox>
      )}
    </div>
  );
}
