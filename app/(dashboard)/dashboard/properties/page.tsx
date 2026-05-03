import Link from "next/link";

import { CardBox } from "@/components/dashboard/card-box";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
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
  const hasActiveFilters = Boolean(params.q || params.status);
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
