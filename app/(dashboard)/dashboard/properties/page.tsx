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
import { listProperties } from "@/server/queries/properties";
import { formatCurrency } from "@/lib/utils";
import { canManageProperties } from "@/lib/permissions";
import {
  getOperationTypeLabel,
  getPropertyStatusLabel,
  getPropertyTypeLabel,
  propertyStatusLabels,
} from "@/lib/ui-labels";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const { activeTenant, activeMembership } = await getActiveTenantContext();
  const canManagePropertyRecords = canManageProperties(activeMembership.role);
  const properties = await listProperties(activeTenant.id, params);
  const hasActiveFilters = Boolean(
    params.q || (params.status && params.status !== "all"),
  );
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
      <FilterCard>
        <form
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_240px_auto_auto]"
          method="get"
        >
          <Input
            aria-label="Buscar propiedades"
            defaultValue={params.q ?? ""}
            name="q"
            placeholder="Buscar por título, ciudad o barrio"
          />
          <NativeSelect
            aria-label="Filtrar por estado"
            defaultValue={params.status ?? "all"}
            name="status"
          >
            <option value="all">Todos los estados</option>
            {Object.entries(propertyStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </NativeSelect>
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
      </FilterCard>
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
