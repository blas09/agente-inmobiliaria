import Link from "next/link";

import { AppointmentRulesForm } from "@/features/appointments/appointment-rules-form";
import { updateAppointmentRulesAction } from "@/features/appointments/actions";
import { getAppointmentRules } from "@/features/appointments/rules";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { MetricCard } from "@/components/shared/metric-card";
import { ActionSheet } from "@/components/shared/action-sheet";
import {
  getActiveTenantContext,
  requireTenantAdminContext,
} from "@/server/auth/tenant-context";
import { canManageTenant } from "@/lib/permissions";
import { getTenantUsers } from "@/server/queries/tenants";
import {
  addTenantUserAction,
  updateCurrentTenantSettingsAction,
  updateTenantUserAction,
} from "@/features/tenants/actions";
import { TenantForm } from "@/features/tenants/tenant-form";
import {
  AddTenantUserForm,
  TenantUsersList,
} from "@/features/tenants/tenant-user-form";
import { Badge } from "@/components/ui/badge";
import { getPipelineStages } from "@/server/queries/leads";
import {
  createPipelineStageAction,
  updatePipelineStageAction,
} from "@/features/pipeline/actions";
import { PipelineStageForm } from "@/features/pipeline/pipeline-stage-form";
import { getPipelineCategoryLabel, getTenantRoleLabel } from "@/lib/ui-labels";

const settingsTabs = [
  { id: "tenant", label: "Tenant" },
  { id: "agenda", label: "Agenda" },
  { id: "team", label: "Equipo" },
  { id: "pipeline", label: "Pipeline" },
] as const;

type SettingsTabId = (typeof settingsTabs)[number]["id"];

function resolveSettingsTab(tab: string | string[] | undefined): SettingsTabId {
  const value = Array.isArray(tab) ? tab[0] : tab;

  return settingsTabs.some((item) => item.id === value)
    ? (value as SettingsTabId)
    : "tenant";
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { tab } = await searchParams;
  const activeTab = resolveSettingsTab(tab);
  const { activeTenant, activeMembership } = await getActiveTenantContext();
  if (!canManageTenant(activeMembership.role)) {
    await requireTenantAdminContext();
  }
  const appointmentRules = getAppointmentRules(activeTenant.settings);
  const [users, stages] = await Promise.all([
    getTenantUsers(activeTenant.id),
    getPipelineStages(activeTenant.id),
  ]);
  const canManage =
    activeMembership.role === "tenant_owner" ||
    activeMembership.role === "tenant_admin";

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title="Configuración"
        description="Parámetros del tenant, equipo, agenda y pipeline que sostienen la operación comercial."
      />
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Workspace"
          tone="primary"
          value={activeTenant.name}
          valueClassName="text-xl"
        />
        <MetricCard
          label="Usuarios activos"
          tone="success"
          value={users.length}
        />
        <MetricCard
          label="Etapas pipeline"
          tone="warning"
          value={stages.length}
        />
      </section>
      <div className="space-y-6">
        <nav className="border-border flex gap-2 overflow-x-auto border-b">
          {settingsTabs.map((item) => (
            <Link
              className={
                activeTab === item.id
                  ? "border-primary text-primary border-b-2 px-4 py-3 text-sm font-semibold whitespace-nowrap"
                  : "text-muted-foreground hover:text-foreground px-4 py-3 text-sm font-medium whitespace-nowrap"
              }
              href={`/dashboard/settings?tab=${item.id}`}
              key={item.id}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {activeTab === "tenant" ? (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Tenant</h2>
              <p className="text-muted-foreground mt-2">
                Datos base del workspace activo y parámetros operativos.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="bg-muted rounded-md px-4 py-3">
                <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
                  Nombre
                </p>
                <p className="mt-1 font-medium">{activeTenant.name}</p>
              </div>
              <div className="bg-muted rounded-md px-4 py-3">
                <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
                  Slug
                </p>
                <p className="mt-1 font-medium">{activeTenant.slug}</p>
              </div>
              <div className="bg-muted rounded-md px-4 py-3">
                <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
                  Moneda
                </p>
                <p className="mt-1 font-medium">
                  {activeTenant.primary_currency}
                </p>
              </div>
              <div className="bg-muted rounded-md px-4 py-3">
                <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
                  Timezone
                </p>
                <p className="mt-1 font-medium">{activeTenant.timezone}</p>
              </div>
            </div>
            {canManage ? (
              <ActionSheet
                triggerLabel="Editar configuración del tenant"
                title="Configuración del tenant"
                description="Actualizá datos operativos del workspace activo."
              >
                <TenantForm
                  action={updateCurrentTenantSettingsAction}
                  initialValues={activeTenant}
                  showStatus={false}
                />
              </ActionSheet>
            ) : null}
          </section>
        ) : null}

        {activeTab === "agenda" ? (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Agenda interna</h2>
              <p className="text-muted-foreground mt-2">
                Reglas operativas de disponibilidad y validación.
              </p>
            </div>
            {canManage ? (
              <AppointmentRulesForm
                action={updateAppointmentRulesAction}
                initialValues={appointmentRules}
                timezone={activeTenant.timezone}
              />
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Duración por defecto
                  </span>
                  <span>{appointmentRules.default_duration_minutes} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buffer</span>
                  <span>{appointmentRules.buffer_minutes} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aviso mínimo</span>
                  <span>{appointmentRules.advance_notice_hours} h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Horario</span>
                  <span>
                    {appointmentRules.business_hours_start} -{" "}
                    {appointmentRules.business_hours_end}
                  </span>
                </div>
              </div>
            )}
          </section>
        ) : null}

        {activeTab === "team" ? (
          <section className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Usuarios del tenant</h2>
                <p className="text-muted-foreground mt-2">
                  Accesos, roles y operación del equipo comercial.
                </p>
              </div>
              {canManage ? (
                <ActionSheet
                  triggerLabel="Agregar miembro"
                  title="Agregar miembro"
                  description="Invitá o activá un usuario dentro del tenant."
                >
                  <AddTenantUserForm action={addTenantUserAction} />
                </ActionSheet>
              ) : null}
            </div>
            {canManage ? (
              <TenantUsersList action={updateTenantUserAction} users={users} />
            ) : (
              <div className="divide-border divide-y">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-4 py-4 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {user.user_profiles?.full_name ??
                          "Perfil sin sincronizar"}
                      </p>
                      <p className="text-muted-foreground">
                        {user.user_profiles?.email ?? user.user_id}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {getTenantRoleLabel(user.role)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {activeTab === "pipeline" ? (
          <section className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Pipeline comercial</h2>
                <p className="text-muted-foreground mt-2">
                  Etapas editables para seguimiento del lead.
                </p>
              </div>
              {canManage ? (
                <ActionSheet
                  triggerLabel="Crear etapa"
                  title="Nueva etapa"
                  description="Agregá una etapa al pipeline comercial del tenant."
                >
                  <PipelineStageForm
                    action={createPipelineStageAction}
                    title="Nueva etapa"
                  />
                </ActionSheet>
              ) : null}
            </div>
            {canManage ? (
              <div className="space-y-4">
                {stages.map((stage) => (
                  <PipelineStageForm
                    key={stage.id}
                    action={updatePipelineStageAction.bind(null, stage.id)}
                    initialValues={{
                      name: stage.name,
                      position: stage.position,
                      category: stage.category,
                      is_default: stage.is_default,
                    }}
                    title={`Etapa: ${stage.name}`}
                  />
                ))}
              </div>
            ) : (
              <div className="divide-border divide-y">
                {stages.map((stage) => (
                  <div
                    key={stage.id}
                    className="flex items-center justify-between gap-4 py-4 text-sm"
                  >
                    <div>
                      <p className="font-medium">{stage.name}</p>
                      <p className="text-muted-foreground">
                        Posición {stage.position} ·{" "}
                        {getPipelineCategoryLabel(stage.category)}
                      </p>
                    </div>
                    {stage.is_default ? (
                      <Badge variant="success">Predeterminada</Badge>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}
      </div>
    </div>
  );
}
