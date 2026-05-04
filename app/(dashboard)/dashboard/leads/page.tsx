import Link from "next/link";

import { CardBox } from "@/components/dashboard/card-box";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

const leadStatusTabs = [
  { id: "all", label: "Todos" },
  ...Object.entries(leadQualificationStatusLabels).map(([status, label]) => ({
    id: status,
    label,
  })),
];

function getLeadTabHref(status: string, query: string | undefined) {
  const params = new URLSearchParams();
  const normalizedQuery = query?.trim();

  if (status !== "all") {
    params.set("status", status);
  }

  if (normalizedQuery) {
    params.set("q", normalizedQuery);
  }

  const search = params.toString();
  return search ? `/dashboard/leads?${search}` : "/dashboard/leads";
}

function resolveLeadStatus(status: string | undefined) {
  return status && status in leadQualificationStatusLabels ? status : "all";
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const { activeTenant, activeMembership } = await getActiveTenantContext();
  const canManageLeadRecords = canManageLeads(activeMembership.role);
  const activeStatus = resolveLeadStatus(params.status);
  const searchQuery = params.q?.trim();
  const leads = await listLeads(activeTenant.id, {
    q: searchQuery,
    status: activeStatus,
  });
  const hasActiveFilters = Boolean(searchQuery || activeStatus !== "all");
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
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Vista de leads</h2>
          <p className="text-muted-foreground mt-2">
            Usá los estados comerciales como tabs y buscá por contacto cuando
            necesites revisar un lead puntual.
          </p>
        </div>
        <nav className="border-border flex gap-2 overflow-x-auto border-b">
          {leadStatusTabs.map((tab) => (
            <Link
              className={
                activeStatus === tab.id
                  ? "border-primary text-primary border-b-2 px-4 py-3 text-sm font-semibold whitespace-nowrap"
                  : "text-muted-foreground hover:text-foreground px-4 py-3 text-sm font-medium whitespace-nowrap"
              }
              href={getLeadTabHref(tab.id, searchQuery)}
              key={tab.id}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <form
          className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
          method="get"
        >
          {activeStatus !== "all" ? (
            <input name="status" type="hidden" value={activeStatus} />
          ) : null}
          <Input
            aria-label="Buscar leads"
            defaultValue={searchQuery ?? ""}
            name="q"
            placeholder="Buscar por nombre, email o teléfono"
          />
          <Button className="w-full" type="submit" variant="lightprimary">
            Aplicar
          </Button>
          {hasActiveFilters ? (
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "w-full",
              })}
              href="/dashboard/leads"
            >
              Limpiar
            </Link>
          ) : null}
        </form>
      </section>
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
          tone={hasActiveFilters ? "search" : "default"}
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
