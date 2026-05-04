import Link from "next/link";

import { CardBox } from "@/components/dashboard/card-box";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { ActionSheet } from "@/components/shared/action-sheet";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { SortableHeader } from "@/components/shared/sortable-header";
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
import {
  getAppointmentListStats,
  listAppointmentsPaginated,
  type AppointmentListSort,
} from "@/server/queries/appointments";
import { listAvailablePropertiesForSelection } from "@/server/queries/properties";
import { getAssignableTenantUsers } from "@/server/queries/tenants";
import { formatDateTime } from "@/lib/utils";
import { canManageAppointments } from "@/lib/permissions";
import {
  buildSearchHref,
  resolvePagination,
  resolveSort,
} from "@/lib/pagination";

const appointmentStatusTabs = [
  { id: "all", label: "Todas" },
  ...Object.entries(appointmentStatusLabels).map(([status, label]) => ({
    id: status,
    label,
  })),
];

function getAppointmentTabHref(
  status: string,
  advisor: string | undefined,
  sort: string,
  direction: string,
) {
  return buildSearchHref(
    "/dashboard/appointments",
    {
      advisor: advisor && advisor !== "all" ? advisor : undefined,
      sort,
      direction,
    },
    { status: status === "all" ? null : status, page: 1 },
  );
}

function resolveAppointmentStatus(status: string | undefined) {
  return status && status in appointmentStatusLabels ? status : "all";
}

const appointmentSorts = [
  "scheduled",
  "status",
] as const satisfies readonly AppointmentListSort[];

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    advisor?: string;
    page?: string;
    pageSize?: string;
    sort?: string;
    direction?: string;
  }>;
}) {
  const params = await searchParams;
  const { activeTenant, activeMembership } = await getActiveTenantContext();
  const canEditAppointments = canManageAppointments(activeMembership.role);
  const appointmentRules = getAppointmentRules(activeTenant.settings);
  const activeStatus = resolveAppointmentStatus(params.status);
  const pagination = resolvePagination(params, 10);
  const sorting = resolveSort(params, appointmentSorts, {
    sort: "scheduled",
    direction: "asc",
  });
  const hasActiveFilters = Boolean(
    activeStatus !== "all" || (params.advisor && params.advisor !== "all"),
  );
  const [appointmentResult, appointmentStats, advisors, properties] =
    await Promise.all([
      listAppointmentsPaginated(
        activeTenant.id,
        {
          status: activeStatus,
          advisorId: params.advisor,
        },
        pagination,
        sorting,
      ),
      getAppointmentListStats(activeTenant.id, {
        advisorId: params.advisor,
      }),
      getAssignableTenantUsers(activeTenant.id),
      listAvailablePropertiesForSelection(activeTenant.id),
    ]);
  const appointments = appointmentResult.items;
  const listParams = {
    status: activeStatus === "all" ? undefined : activeStatus,
    advisor:
      params.advisor && params.advisor !== "all" ? params.advisor : undefined,
    page: pagination.page,
    pageSize: pagination.pageSize,
    sort: sorting.sort,
    direction: sorting.direction,
  };

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
            value: appointmentResult.total,
            tone: "primary",
          },
          {
            key: "confirmed",
            label: "Confirmadas",
            value: appointmentStats.confirmed,
            tone: "success",
          },
          {
            key: "scheduled",
            label: "Pendientes",
            value: appointmentStats.scheduled,
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
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Vista de agenda</h2>
          <p className="text-muted-foreground mt-2">
            Usá los estados como tabs y filtrá por asesor cuando necesites
            revisar una operación puntual.
          </p>
        </div>
        <nav className="border-border flex gap-2 overflow-x-auto border-b">
          {appointmentStatusTabs.map((tab) => (
            <Link
              className={
                activeStatus === tab.id
                  ? "border-primary text-primary border-b-2 px-4 py-3 text-sm font-semibold whitespace-nowrap"
                  : "text-muted-foreground hover:text-foreground px-4 py-3 text-sm font-medium whitespace-nowrap"
              }
              href={getAppointmentTabHref(
                tab.id,
                params.advisor,
                sorting.sort,
                sorting.direction,
              )}
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
          <input name="sort" type="hidden" value={sorting.sort} />
          <input name="direction" type="hidden" value={sorting.direction} />
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
          <Button className="w-full" type="submit" variant="lightprimary">
            Aplicar
          </Button>
          {hasActiveFilters ? (
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "w-full",
              })}
              href="/dashboard/appointments"
            >
              Limpiar
            </Link>
          ) : null}
        </form>
      </section>
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
          tone={hasActiveFilters ? "search" : "default"}
        />
      ) : (
        <div className="space-y-4">
          <section className="flex flex-wrap gap-3 border-b pb-4 text-sm">
            <SortableHeader
              activeSort={sorting.sort}
              direction={sorting.direction}
              label="Fecha"
              params={listParams}
              pathname="/dashboard/appointments"
              sortKey="scheduled"
            />
            <SortableHeader
              activeSort={sorting.sort}
              direction={sorting.direction}
              label="Estado"
              params={listParams}
              pathname="/dashboard/appointments"
              sortKey="status"
            />
          </section>
          <CardBox className="overflow-hidden">
            <div className="divide-border divide-y">
              {appointments.map((appointment) => (
                <div
                  className="grid gap-4 px-5 py-4 xl:grid-cols-[minmax(220px,0.8fr)_minmax(320px,1fr)_minmax(240px,0.8fr)_auto] xl:items-center"
                  key={appointment.id}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        className="hover:text-primary truncate font-semibold"
                        href={`/dashboard/leads/${appointment.lead_id}`}
                      >
                        {appointment.lead?.full_name ?? "Lead no disponible"}
                      </Link>
                      <Badge
                        variant={getAppointmentStatusTone(appointment.status)}
                      >
                        {getAppointmentStatusLabel(appointment.status)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {formatDateTime(appointment.scheduled_at)}
                    </p>
                  </div>
                  <div className="min-w-0 text-sm">
                    <p className="truncate font-medium">
                      {appointment.property?.title ??
                        (appointment.property_id
                          ? "Propiedad no disponible"
                          : "Sin propiedad")}
                    </p>
                    <p className="text-muted-foreground mt-1 truncate">
                      {appointment.advisor?.full_name ??
                        appointment.advisor?.email ??
                        "Sin asignar"}
                    </p>
                  </div>
                  <div className="text-muted-foreground min-w-0 text-sm">
                    <p className="truncate">
                      {appointment.lead?.phone ??
                        appointment.lead?.email ??
                        "Sin contacto"}
                    </p>
                    {appointment.notes ? (
                      <p className="mt-1 line-clamp-1">{appointment.notes}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                    {appointment.property_id ? (
                      <Link
                        className="text-primary text-sm font-medium hover:underline"
                        href={`/dashboard/properties/${appointment.property_id}`}
                      >
                        Ver propiedad
                      </Link>
                    ) : null}
                    {canEditAppointments ? (
                      <ActionSheet
                        triggerLabel="Editar visita"
                        title="Gestión de la visita"
                        description="Actualizá fecha, responsable, estado, propiedad o notas internas."
                      >
                        <AppointmentForm
                          action={updateAppointmentAction.bind(
                            null,
                            appointment.id,
                            ["/dashboard/appointments"],
                          )}
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
                          rulesSummary={summarizeAppointmentRules(
                            appointmentRules,
                          )}
                          submitLabel="Actualizar visita"
                          timezone={activeTenant.timezone}
                          title="Gestión de la visita"
                        />
                      </ActionSheet>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </CardBox>
          <PaginationControls
            page={pagination.page}
            pageSize={pagination.pageSize}
            params={listParams}
            pathname="/dashboard/appointments"
            total={appointmentResult.total}
          />
        </div>
      )}
    </div>
  );
}
