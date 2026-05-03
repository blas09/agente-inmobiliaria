import Link from "next/link";

import { CardBox } from "@/components/dashboard/card-box";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { AppointmentForm } from "@/features/appointments/appointment-form";
import { updateAppointmentAction } from "@/features/appointments/actions";
import {
  getAppointmentRules,
  summarizeAppointmentRules,
} from "@/features/appointments/rules";
import {
  appointmentStatusLabels,
  getAppointmentStatusLabel,
  getAppointmentStatusTone,
} from "@/features/appointments/status";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { listAppointments } from "@/server/queries/appointments";
import { listAvailablePropertiesForSelection } from "@/server/queries/properties";
import { getAssignableTenantUsers } from "@/server/queries/tenants";
import { formatDateTime } from "@/lib/utils";
import { canManageAppointments } from "@/lib/permissions";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; advisor?: string }>;
}) {
  const params = await searchParams;
  const { activeTenant, activeMembership } = await getActiveTenantContext();
  const canEditAppointments = canManageAppointments(activeMembership.role);
  const appointmentRules = getAppointmentRules(activeTenant.settings);
  const hasActiveFilters = Boolean(
    (params.status && params.status !== "all") ||
    (params.advisor && params.advisor !== "all"),
  );
  const [appointments, advisors, properties] = await Promise.all([
    listAppointments(activeTenant.id, {
      status: params.status,
      advisorId: params.advisor,
    }),
    getAssignableTenantUsers(activeTenant.id),
    listAvailablePropertiesForSelection(activeTenant.id),
  ]);

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title="Agenda"
        description="Visitas internas vinculadas a leads, propiedades y asesores."
      />
      <DashboardTopCards
        items={[
          {
            key: "total",
            label: "Visitas",
            value: appointments.length,
            tone: "primary",
          },
          {
            key: "confirmed",
            label: "Confirmadas",
            value: appointments.filter(
              (appointment) => appointment.status === "confirmed",
            ).length,
            tone: "success",
          },
          {
            key: "scheduled",
            label: "Pendientes",
            value: appointments.filter(
              (appointment) => appointment.status === "scheduled",
            ).length,
            tone: "warning",
          },
        ]}
      />
      <CardBox>
        <CardHeader>
          <CardTitle>Reglas activas de agenda</CardTitle>
          <CardDescription>
            Validaciones del tenant aplicadas al crear o editar visitas.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          {summarizeAppointmentRules(appointmentRules)} · aviso mínimo{" "}
          {appointmentRules.advance_notice_hours} h · timezone{" "}
          {activeTenant.timezone}
        </CardContent>
      </CardBox>
      <CardBox>
        <CardHeader>
          <CardTitle>Vista de agenda</CardTitle>
          <CardDescription>
            Filtrá por estado o asesor para revisar el avance operativo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-[1fr_1fr_auto_auto]"
            method="get"
          >
            <NativeSelect
              aria-label="Filtrar por estado"
              defaultValue={params.status ?? "all"}
              name="status"
            >
              <option value="all">Todos los estados</option>
              {Object.entries(appointmentStatusLabels).map(
                ([status, label]) => (
                  <option key={status} value={status}>
                    {label}
                  </option>
                ),
              )}
            </NativeSelect>
            <NativeSelect
              aria-label="Filtrar por asesor"
              defaultValue={params.advisor ?? "all"}
              name="advisor"
            >
              <option value="all">Todos los asesores</option>
              {advisors.map((advisor) => (
                <option key={advisor.user_id} value={advisor.user_id}>
                  {advisor.user_profiles?.full_name ??
                    advisor.user_profiles?.email ??
                    advisor.user_id}
                </option>
              ))}
            </NativeSelect>
            <Button type="submit" variant="lightprimary">
              Aplicar
            </Button>
            {hasActiveFilters ? (
              <Link
                className={buttonVariants({ variant: "outline" })}
                href="/dashboard/appointments"
              >
                Limpiar
              </Link>
            ) : null}
          </form>
        </CardContent>
      </CardBox>
      {appointments.length === 0 ? (
        <EmptyState
          title={
            hasActiveFilters
              ? "Sin visitas para este filtro"
              : "No hay visitas cargadas"
          }
          description={
            hasActiveFilters
              ? "Probá limpiar los filtros o revisar otro asesor o estado de visita."
              : "Podés agendarlas desde un lead o una conversación con lead vinculado."
          }
          actionHref={
            hasActiveFilters
              ? "/dashboard/appointments"
              : canEditAppointments
                ? "/dashboard/leads"
                : undefined
          }
          actionLabel={
            hasActiveFilters
              ? "Limpiar filtros"
              : canEditAppointments
                ? "Ir a leads"
                : undefined
          }
        />
      ) : (
        <div className="grid gap-6">
          {appointments.map((appointment) => (
            <div
              className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
              key={appointment.id}
            >
              <CardBox>
                <CardHeader>
                  <CardTitle className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <span>
                      {appointment.lead?.full_name ?? "Lead no disponible"}
                    </span>
                    <Badge
                      variant={getAppointmentStatusTone(appointment.status)}
                    >
                      {getAppointmentStatusLabel(appointment.status)}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {appointment.lead?.phone ??
                      appointment.lead?.email ??
                      "Sin contacto"}{" "}
                    ·{" "}
                    {appointment.property?.title ??
                      (appointment.property_id
                        ? "Propiedad no disponible"
                        : "Sin propiedad")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Fecha</span>
                    <span>{formatDateTime(appointment.scheduled_at)}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Asesor</span>
                    <span>
                      {appointment.advisor?.full_name ??
                        appointment.advisor?.email ??
                        "Sin asignar"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Estado</span>
                    <span>{getAppointmentStatusLabel(appointment.status)}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Propiedad</span>
                    <span>
                      {appointment.property?.title ??
                        (appointment.property_id
                          ? "Propiedad no disponible"
                          : "Sin propiedad")}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Contacto</span>
                    <span>
                      {appointment.lead?.phone ??
                        appointment.lead?.email ??
                        "Sin contacto"}
                    </span>
                  </div>
                  {appointment.notes ? (
                    <div className="border-border bg-lightprimary rounded-xl border p-4">
                      <p className="text-muted-foreground">Notas</p>
                      <p className="mt-1">{appointment.notes}</p>
                    </div>
                  ) : null}
                  <div className="flex gap-3 text-sm">
                    <Link
                      className="text-primary hover:underline"
                      href={`/dashboard/leads/${appointment.lead_id}`}
                    >
                      Ver flujo del lead
                    </Link>
                    {appointment.property_id ? (
                      <Link
                        className="text-primary hover:underline"
                        href={`/dashboard/properties/${appointment.property_id}`}
                      >
                        Ver propiedad
                      </Link>
                    ) : null}
                  </div>
                </CardContent>
              </CardBox>
              {canEditAppointments ? (
                <AppointmentForm
                  action={updateAppointmentAction.bind(null, appointment.id, [
                    "/dashboard/appointments",
                  ])}
                  advisorOptions={advisors.map((advisor) => ({
                    id: advisor.user_id,
                    label:
                      advisor.user_profiles?.full_name ??
                      advisor.user_profiles?.email ??
                      advisor.user_id,
                    role: advisor.role,
                  }))}
                  initialValues={{
                    scheduled_at: appointment.scheduled_at,
                    status: appointment.status,
                    property_id: appointment.property_id,
                    advisor_id: appointment.advisor_id,
                    notes: appointment.notes,
                  }}
                  propertyOptions={properties.map((property) => ({
                    id: property.id,
                    label: `${property.title}${property.external_ref ? ` · ${property.external_ref}` : ""}`,
                  }))}
                  rulesSummary={summarizeAppointmentRules(appointmentRules)}
                  submitLabel="Actualizar visita"
                  timezone={activeTenant.timezone}
                  title="Gestión de la visita"
                />
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
