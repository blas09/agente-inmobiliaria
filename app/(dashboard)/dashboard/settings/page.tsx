import { AppointmentRulesForm } from "@/features/appointments/appointment-rules-form";
import { updateAppointmentRulesAction } from "@/features/appointments/actions";
import { getAppointmentRules } from "@/features/appointments/rules";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { MetricCard } from "@/components/shared/metric-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  getTenantRoleLabel,
  TenantUsersList,
} from "@/features/tenants/tenant-user-form";
import { Badge } from "@/components/ui/badge";
import { getPipelineStages } from "@/server/queries/leads";
import {
  createPipelineStageAction,
  updatePipelineStageAction,
} from "@/features/pipeline/actions";
import { PipelineStageForm } from "@/features/pipeline/pipeline-stage-form";

export default async function SettingsPage() {
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
      <ProfileWelcome title="Configuración" />
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
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {canManage ? (
          <TenantForm
            action={updateCurrentTenantSettingsAction}
            initialValues={activeTenant}
            showStatus={false}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Tenant</CardTitle>
              <CardDescription>
                Datos base del workspace activo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nombre</span>
                <span>{activeTenant.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slug</span>
                <span>{activeTenant.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Moneda</span>
                <span>{activeTenant.primary_currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timezone</span>
                <span>{activeTenant.timezone}</span>
              </div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Agenda interna</CardTitle>
            <CardDescription>
              Reglas operativas de disponibilidad y validación.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Usuarios del tenant</CardTitle>
            <CardDescription>
              Accesos, roles y operación del equipo comercial.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {canManage ? (
              <AddTenantUserForm action={addTenantUserAction} />
            ) : null}
            {canManage ? (
              <TenantUsersList action={updateTenantUserAction} users={users} />
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="border-border bg-card flex items-center justify-between rounded-xl border px-4 py-3 text-sm"
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
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pipeline comercial</CardTitle>
            <CardDescription>
              Etapas editables para seguimiento del lead.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {canManage ? (
              <>
                <PipelineStageForm
                  action={createPipelineStageAction}
                  title="Nueva etapa"
                />
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
              </>
            ) : (
              stages.map((stage) => (
                <div
                  key={stage.id}
                  className="border-border bg-card flex items-center justify-between rounded-xl border px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{stage.name}</p>
                    <p className="text-muted-foreground">
                      Posición {stage.position} · {stage.category}
                    </p>
                  </div>
                  {stage.is_default ? (
                    <Badge variant="success">default</Badge>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
