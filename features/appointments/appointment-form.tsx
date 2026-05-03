"use client";

import { useActionState } from "react";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";

import { ActionFeedback } from "@/components/shared/action-feedback";
import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTimeLocalInput } from "@/lib/utils";
import { appointmentStatusLabels } from "@/features/appointments/status";
import { getTenantRoleLabel } from "@/lib/ui-labels";

interface AppointmentFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  title: string;
  submitLabel: string;
  pendingLabel?: string;
  timezone: string;
  initialValues?: {
    scheduled_at?: string | null;
    status?: string;
    property_id?: string | null;
    advisor_id?: string | null;
    notes?: string | null;
  };
  advisorOptions: Array<{ id: string; label: string; role: string }>;
  propertyOptions: Array<{ id: string; label: string }>;
  rulesSummary?: string;
}

export function AppointmentForm({
  action,
  title,
  submitLabel,
  pendingLabel,
  timezone,
  initialValues,
  advisorOptions,
  propertyOptions,
  rulesSummary,
}: AppointmentFormProps) {
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Fecha, responsable, propiedad y notas internas de la visita.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          {rulesSummary ? (
            <div className="border-border bg-lightprimary rounded-xl border px-4 py-3 text-sm">
              <p className="text-foreground font-medium">Reglas activas</p>
              <p className="text-muted-foreground mt-1">{rulesSummary}</p>
              <p className="text-muted-foreground mt-1">Timezone: {timezone}</p>
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              htmlFor="scheduled_at"
              label="Fecha y hora"
              error={state.fieldErrors?.scheduled_at?.[0]}
              description="Debe respetar días, horario, duración y buffer configurados."
            >
              <Input
                defaultValue={formatDateTimeLocalInput(
                  initialValues?.scheduled_at,
                  timezone,
                )}
                id="scheduled_at"
                name="scheduled_at"
                type="datetime-local"
              />
            </FormField>
            <FormField
              htmlFor="status"
              label="Estado"
              error={state.fieldErrors?.status?.[0]}
              description="Usalo para confirmar, cerrar o cancelar la visita."
            >
              <NativeSelect
                defaultValue={initialValues?.status ?? "scheduled"}
                id="status"
                name="status"
              >
                {Object.entries(appointmentStatusLabels).map(
                  ([status, label]) => (
                    <option key={status} value={status}>
                      {label}
                    </option>
                  ),
                )}
              </NativeSelect>
            </FormField>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              htmlFor="property_id"
              label="Propiedad"
              error={state.fieldErrors?.property_id?.[0]}
              description="Opcional si la visita todavía no tiene inmueble definido."
            >
              <NativeSelect
                defaultValue={initialValues?.property_id ?? ""}
                id="property_id"
                name="property_id"
              >
                <option value="">Sin propiedad puntual</option>
                {propertyOptions.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.label}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
            <FormField
              htmlFor="advisor_id"
              label="Asesor"
              error={state.fieldErrors?.advisor_id?.[0]}
              description="Responsable interno de coordinar la visita."
            >
              <NativeSelect
                defaultValue={initialValues?.advisor_id ?? ""}
                id="advisor_id"
                name="advisor_id"
              >
                <option value="">Sin asignar</option>
                {advisorOptions.map((advisor) => (
                  <option key={advisor.id} value={advisor.id}>
                    {advisor.label} · {getTenantRoleLabel(advisor.role)}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
          </div>
          <FormField htmlFor="notes" label="Notas">
            <Textarea
              className="min-h-24"
              defaultValue={initialValues?.notes ?? ""}
              id="notes"
              name="notes"
            />
          </FormField>
          {state.message ? (
            <ActionFeedback message={state.message} status={state.status} />
          ) : null}
          <SubmitButton
            label={submitLabel}
            pendingLabel={pendingLabel ?? "Guardando visita..."}
            shape="pill"
          />
        </form>
      </CardContent>
    </Card>
  );
}
