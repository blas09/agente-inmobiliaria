import Link from "next/link";

import { deletePropertyAction } from "@/features/properties/actions";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { EmptyState } from "@/components/shared/empty-state";
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
import { getPropertyAppointments } from "@/server/queries/appointments";
import {
  getPropertyById,
  getPropertyConversations,
} from "@/server/queries/properties";
import { canDeleteProperties, canManageProperties } from "@/lib/permissions";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  getAppointmentStatusLabel,
  getAppointmentStatusTone,
} from "@/features/appointments/status";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { activeTenant, activeMembership } = await getActiveTenantContext();
  const [property, conversations, appointments] = await Promise.all([
    getPropertyById(activeTenant.id, id),
    getPropertyConversations(activeTenant.id, id),
    getPropertyAppointments(activeTenant.id, id),
  ]);
  const deleteAction = deletePropertyAction.bind(null, property.id);
  const canEditProperty = canManageProperties(activeMembership.role);
  const canDeleteProperty = canDeleteProperties(activeMembership.role);

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title={property.title}
        action={
          canEditProperty || canDeleteProperty ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {canEditProperty ? (
                <Link
                  className="text-primary inline-flex items-center text-sm font-medium hover:underline"
                  href={`/dashboard/properties/${property.id}/edit`}
                >
                  Editar
                </Link>
              ) : null}
              {canDeleteProperty ? (
                <form action={deleteAction}>
                  <Button type="submit" variant="destructive" shape="pill">
                    Eliminar
                  </Button>
                </form>
              ) : null}
            </div>
          ) : null
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
      <Card>
        <CardHeader>
          <CardTitle>Contexto operativo</CardTitle>
          <CardDescription>
            Conversaciones y leads vinculados a esta propiedad.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {conversations.length === 0 ? (
            <EmptyState
              title="Sin conversaciones vinculadas"
              description="Cuando una conversación se asocie a esta propiedad, el lead y el contacto van a quedar visibles acá."
              actionHref="/dashboard/conversations"
              actionLabel="Ver conversaciones"
            />
          ) : (
            conversations.map((conversation) => (
              <div
                className="border-border bg-card rounded-xl border px-4 py-3"
                key={conversation.id}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Link
                      className="text-primary font-medium hover:underline"
                      href={`/dashboard/conversations/${conversation.id}`}
                    >
                      {conversation.contact_display_name ??
                        conversation.contact_identifier ??
                        "Conversación sin nombre"}
                    </Link>
                    <p className="text-muted-foreground mt-1">
                      {conversation.status} ·{" "}
                      {formatDateTime(conversation.last_message_at)}
                    </p>
                  </div>
                  <Badge variant="outline">{conversation.status}</Badge>
                </div>
                <div className="text-muted-foreground mt-3">
                  Lead:{" "}
                  {conversation.leads ? (
                    <Link
                      className="text-primary hover:underline"
                      href={`/dashboard/leads/${conversation.leads.id}`}
                    >
                      {conversation.leads.full_name}
                      {conversation.leads.phone
                        ? ` · ${conversation.leads.phone}`
                        : ""}
                    </Link>
                  ) : conversation.lead_id ? (
                    <span className="text-foreground">Lead no disponible</span>
                  ) : (
                    <span className="text-foreground">Sin lead</span>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Visitas de la propiedad</CardTitle>
          <CardDescription>
            Agenda interna asociada a esta ficha comercial.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {appointments.length === 0 ? (
            <EmptyState
              title="Sin visitas agendadas"
              description="Las visitas cargadas desde leads o conversaciones para esta propiedad van a aparecer acá."
              actionHref="/dashboard/appointments"
              actionLabel="Ver agenda"
            />
          ) : (
            appointments.map((appointment) => (
              <div
                className="border-border bg-card rounded-xl border px-4 py-3"
                key={appointment.id}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-medium">
                      {formatDateTime(appointment.scheduled_at)}
                    </p>
                    <p className="text-muted-foreground mt-1">
                      {appointment.lead?.full_name ?? "Lead no disponible"} ·{" "}
                      {appointment.advisor?.full_name ??
                        appointment.advisor?.email ??
                        "Sin asesor"}
                    </p>
                  </div>
                  <Badge variant={getAppointmentStatusTone(appointment.status)}>
                    {getAppointmentStatusLabel(appointment.status)}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <Link
                    className="text-primary hover:underline"
                    href={`/dashboard/leads/${appointment.lead_id}`}
                  >
                    Ver lead
                  </Link>
                  <Link
                    className="text-primary hover:underline"
                    href="/dashboard/appointments"
                  >
                    Ver agenda
                  </Link>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
