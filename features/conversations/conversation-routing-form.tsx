"use client";

import { useActionState } from "react";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";

import { ActionFeedback } from "@/components/shared/action-feedback";
import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { conversationStatusLabels, getTenantRoleLabel } from "@/lib/ui-labels";

interface ConversationRoutingFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initialValues: {
    assigned_to: string | null;
    status: string;
    handoff_reason: string | null;
    ai_enabled: boolean;
  };
  advisorOptions: Array<{ id: string; label: string; role: string }>;
}

export function ConversationRoutingForm({
  action,
  initialValues,
  advisorOptions,
}: ConversationRoutingFormProps) {
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Routing y handoff</CardTitle>
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
          <FormField htmlFor="status" label="Estado">
            <NativeSelect
              defaultValue={initialValues.status}
              id="status"
              name="status"
            >
              {Object.entries(conversationStatusLabels).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </NativeSelect>
          </FormField>
          <FormField htmlFor="handoff_reason" label="Motivo de handoff">
            <Textarea
              defaultValue={initialValues.handoff_reason ?? ""}
              id="handoff_reason"
              name="handoff_reason"
            />
          </FormField>
          <label className="flex items-center gap-2 text-sm">
            <input
              defaultChecked={initialValues.ai_enabled}
              name="ai_enabled"
              type="checkbox"
            />
            IA habilitada en esta conversación
          </label>
          {state.message ? (
            <ActionFeedback message={state.message} status={state.status} />
          ) : null}
          <SubmitButton
            label="Actualizar conversación"
            pendingLabel="Guardando..."
          />
        </form>
      </CardContent>
    </Card>
  );
}
