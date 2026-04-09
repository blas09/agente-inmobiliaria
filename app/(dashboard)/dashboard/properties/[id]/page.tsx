import Link from "next/link";

import { deletePropertyAction } from "@/features/properties/actions";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { getPropertyById } from "@/server/queries/properties";
import { formatCurrency } from "@/lib/utils";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { activeTenant } = await getActiveTenantContext();
  const property = await getPropertyById(activeTenant.id, id);
  const deleteAction = deletePropertyAction.bind(null, property.id);

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title={property.title}
        action={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              className="text-primary inline-flex items-center text-sm font-medium hover:underline"
              href={`/dashboard/properties/${property.id}/edit`}
            >
              Editar
            </Link>
            <form action={deleteAction}>
              <Button type="submit" variant="destructive" shape="pill">
                Eliminar
              </Button>
            </form>
          </div>
        }
      />
      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent>
            <p className="text-muted-foreground text-sm">Estado</p>
            <div className="mt-3">
              <Badge
                variant={
                  property.status === "available"
                    ? "lightSuccess"
                    : "lightPrimary"
                }
              >
                {property.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-muted-foreground text-sm">Operación</p>
            <p className="mt-3 text-lg font-semibold capitalize">
              {property.operation_type}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-muted-foreground text-sm">Tipo</p>
            <p className="mt-3 text-lg font-semibold capitalize">
              {property.property_type}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-muted-foreground text-sm">Precio</p>
            <p className="mt-3 text-lg font-semibold">
              {formatCurrency(
                property.price,
                property.currency,
                activeTenant.locale,
              )}
            </p>
          </CardContent>
        </Card>
      </section>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Ficha comercial</CardTitle>
            <CardDescription>
              Datos estructurados usados como source of truth.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-muted-foreground">Dormitorios</span>
              <span>{property.bedrooms ?? "N/D"}</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-muted-foreground">Baños</span>
              <span>{property.bathrooms ?? "N/D"}</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-muted-foreground">Superficie</span>
              <span>{property.area_m2 ?? "N/D"} m²</span>
            </div>
            <div className="border-border bg-muted grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
                  Ciudad
                </p>
                <p className="mt-1 font-medium">
                  {property.city ?? "No cargada"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                  Barrio
                </p>
                <p className="mt-1 font-medium">
                  {property.neighborhood ?? "No cargado"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                  Dirección
                </p>
                <p className="mt-1 font-medium">
                  {property.address ?? "No cargada"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                  Referencia externa
                </p>
                <p className="mt-1 font-medium">
                  {property.external_ref ?? "Sin referencia"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
            <CardDescription>
              Copy comercial, atributos y regla de producto.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-foreground/80 leading-7">
              {property.description ?? "Sin descripción cargada."}
            </p>
            <div className="border-border bg-lightprimary rounded-xl border p-4">
              <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                Regla de producto
              </p>
              <p className="mt-2">
                Esta ficha es la verdad de negocio. La IA puede redactar
                respuestas, pero no modificar disponibilidad ni precio por su
                cuenta.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border-border bg-card rounded-xl border px-4 py-3">
                <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                  Atributos
                </p>
                <p className="mt-2">
                  {[
                    property.pets_allowed ? "Mascotas" : null,
                    property.furnished ? "Amoblada" : null,
                    property.has_pool ? "Piscina" : null,
                    property.has_garden ? "Jardín" : null,
                    property.has_balcony ? "Balcón" : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "Sin atributos destacados"}
                </p>
              </div>
              <div className="border-border bg-card rounded-xl border px-4 py-3">
                <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                  Superficie lote
                </p>
                <p className="mt-2">
                  {property.lot_area_m2
                    ? `${property.lot_area_m2} m²`
                    : "No cargada"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
