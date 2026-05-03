"use client";

import { useActionState } from "react";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";

import { ActionFeedback } from "@/components/shared/action-feedback";
import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import {
  getTenantRoleLabel,
  leadQualificationStatusLabels,
} from "@/lib/ui-labels";

interface LeadRoutingFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initialValues: {
    assigned_to: string | null;
    pipeline_stage_id: string | null;
    qualification_status: string;
    is_human_handoff_required: boolean;
  };
  stageOptions: Array<{ id: string; name: string }>;
  advisorOptions: Array<{ id: string; label: string; role: string }>;
}

export function LeadRoutingForm({
  action,
  initialValues,
  stageOptions,
  advisorOptions,
}: LeadRoutingFormProps) {
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operación comercial</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <FormField htmlFor="assigned_to" label="Asesor asignado">
            <NativeSelect
              defaultValue={initialValues.assigned_to ?? ""}
              id="assigned_to"
              name="assigned_to"
            >
              <option value="">Sin asignar</option>
              {advisorOptions.map((advisor) => (
                <option key={advisor.id} value={advisor.id}>
                  {advisor.label} · {getTenantRoleLabel(advisor.role)}
                </option>
              ))}
            </NativeSelect>
          </FormField>
          <FormField htmlFor="qualification_status" label="Estado comercial">
            <NativeSelect
              defaultValue={initialValues.qualification_status}
              id="qualification_status"
              name="qualification_status"
            >
              {Object.entries(leadQualificationStatusLabels).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </NativeSelect>
          </FormField>
          <FormField htmlFor="pipeline_stage_id" label="Etapa del pipeline">
            <NativeSelect
              defaultValue={initialValues.pipeline_stage_id ?? ""}
              id="pipeline_stage_id"
              name="pipeline_stage_id"
            >
              <option value="">Sin etapa</option>
              {stageOptions.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </NativeSelect>
          </FormField>
          <label className="flex items-center gap-2 text-sm">
            <input
              defaultChecked={initialValues.is_human_handoff_required}
              name="is_human_handoff_required"
              type="checkbox"
            />
            Requiere derivación humana
          </label>
          {state.message ? (
            <ActionFeedback message={state.message} status={state.status} />
          ) : null}
          <SubmitButton
            label="Actualizar operación"
            pendingLabel="Guardando..."
          />
        </form>
      </CardContent>
    </Card>
  );
}
