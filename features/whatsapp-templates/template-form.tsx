"use client";

import { useActionState } from "react";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";
import { ActionFeedback } from "@/components/shared/action-feedback";
import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

const statusOptions = [
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
  { value: "paused", label: "Paused" },
];

export function WhatsAppTemplateForm({
  action,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo template WhatsApp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              htmlFor="name"
              label="Nombre"
              error={state.fieldErrors?.name?.[0]}
            >
              <Input id="name" name="name" placeholder="lead_update" required />
            </FormField>
            <FormField
              htmlFor="language"
              label="Idioma"
              error={state.fieldErrors?.language?.[0]}
            >
              <Input
                id="language"
                name="language"
                placeholder="en_US"
                defaultValue="en_US"
              />
            </FormField>
            <FormField htmlFor="category" label="Categoría">
              <Input id="category" name="category" placeholder="UTILITY" />
            </FormField>
            <FormField htmlFor="status" label="Estado">
              <NativeSelect id="status" name="status" defaultValue="approved">
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
          </div>
          <FormField htmlFor="components" label="Componentes (JSON)">
            <Textarea
              id="components"
              name="components"
              placeholder='[{"type":"body","parameters":[{"type":"text","text":"Hola"}]}]'
              rows={4}
            />
          </FormField>
          <div className="flex items-center justify-end">
            <SubmitButton label="Guardar template" pendingLabel="Guardando..." />
          </div>
        </form>
        {state.message ? (
          <ActionFeedback message={state.message} status={state.status} />
        ) : null}
      </CardContent>
    </Card>
  );
}
