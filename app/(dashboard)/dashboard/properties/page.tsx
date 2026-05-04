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
import { listProperties } from "@/server/queries/properties";
import { formatCurrency } from "@/lib/utils";
import { canManageProperties } from "@/lib/permissions";
import {
  getOperationTypeLabel,
  getPropertyStatusLabel,
  getPropertyTypeLabel,
  propertyStatusLabels,
} from "@/lib/ui-labels";

const propertyStatusTabs = [
  { id: "all", label: "Todas" },
  ...Object.entries(propertyStatusLabels).map(([status, label]) => ({
    id: status,
    label,
  })),
];

function getPropertyTabHref(status: string, query: string | undefined) {
  const params = new URLSearchParams();
  const normalizedQuery = query?.trim();

  if (status !== "all") {
    params.set("status", status);
  }

  if (normalizedQuery) {
    params.set("q", normalizedQuery);
  }

  const search = params.toString();
  return search ? `/dashboard/properties?${search}` : "/dashboard/properties";
}

function resolvePropertyStatus(status: string | undefined) {
  return status && status in propertyStatusLabels ? status : "all";
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const { activeTenant, activeMembership } = await getActiveTenantContext();
  const canManagePropertyRecords = canManageProperties(activeMembership.role);
  const activeStatus = resolvePropertyStatus(params.status);
  const searchQuery = params.q?.trim();
  const properties = await listProperties(activeTenant.id, {
    q: searchQuery,
    status: activeStatus,
  });
  const hasActiveFilters = Boolean(searchQuery || activeStatus !== "all");
  const availableCount = properties.filter(
    (property) => property.status === "available",
  ).length;
  const draftCount = properties.filter(
    (property) => property.status === "draft",
  ).length;

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title="Propiedades"
        description="Catálogo comercial que alimenta leads, conversaciones y visitas."
        action={
          canManagePropertyRecords ? (
            <Link href="/dashboard/properties/new">
              <Button>Nueva propiedad</Button>
            </Link>
          ) : null
        }
      />
      <DashboardTopCards
        items={[
          {
            key: "total",
            label: "Total propiedades",
            value: properties.length,
            tone: "primary",
          },
          {
            key: "available",
            label: "Disponibles",
            value: availableCount,
            tone: "success",
          },
          {
            key: "draft",
            label: "Borradores",
            value: draftCount,
            tone: "warning",
          },
        ]}
      />
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Vista de propiedades</h2>
          <p className="text-muted-foreground mt-2">
            Usá los estados como tabs y buscá por datos comerciales cuando
            necesites encontrar una ficha puntual.
          </p>
        </div>
        <nav className="border-border flex gap-2 overflow-x-auto border-b">
          {propertyStatusTabs.map((tab) => (
            <Link
              className={
                activeStatus === tab.id
                  ? "border-primary text-primary border-b-2 px-4 py-3 text-sm font-semibold whitespace-nowrap"
                  : "text-muted-foreground hover:text-foreground px-4 py-3 text-sm font-medium whitespace-nowrap"
              }
              href={getPropertyTabHref(tab.id, searchQuery)}
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
            aria-label="Buscar propiedades"
            defaultValue={searchQuery ?? ""}
            name="q"
            placeholder="Buscar por título, ciudad o barrio"
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
              href="/dashboard/properties"
            >
              Limpiar
            </Link>
          ) : null}
        </form>
      </section>
      {properties.length === 0 ? (
        <EmptyState
          title={
            hasActiveFilters
              ? "Sin propiedades para este filtro"
              : "No hay propiedades cargadas"
          }
          description={
            hasActiveFilters
              ? "Probá limpiar los filtros o buscar por otro dato de la ficha comercial."
              : "El MVP necesita este catálogo para responder FAQs y asociar leads a oferta real."
          }
          actionHref={
            hasActiveFilters
              ? "/dashboard/properties"
              : canManagePropertyRecords
                ? "/dashboard/properties/new"
                : undefined
          }
          actionLabel={
            hasActiveFilters
              ? "Limpiar filtros"
              : canManagePropertyRecords
                ? "Cargar propiedad"
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
                  <TableHead className="px-6">Propiedad</TableHead>
                  <TableHead>Operación</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead className="pr-6">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="min-w-[280px] px-6 py-5">
                      <Link
                        className="text-foreground hover:text-primary font-semibold"
                        href={`/dashboard/properties/${property.id}`}
                      >
                        {property.title}
                      </Link>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {property.external_ref ?? "sin ref"} ·{" "}
                        {getPropertyTypeLabel(property.property_type)}
                      </p>
                    </TableCell>
                    <TableCell>
                      {getOperationTypeLabel(property.operation_type)}
                    </TableCell>
                    <TableCell>
                      {property.location_text ??
                        property.city ??
                        "Sin ubicación"}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">
                      {formatCurrency(
                        property.price,
                        property.currency,
                        activeTenant.locale,
                      )}
                    </TableCell>
                    <TableCell className="pr-6">
                      <Badge
                        variant={
                          property.status === "available"
                            ? "lightSuccess"
                            : "outline"
                        }
                      >
                        {getPropertyStatusLabel(property.status)}
                      </Badge>
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
