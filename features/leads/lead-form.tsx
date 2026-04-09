"use client";

import { useActionState } from "react";
import type { Tables } from "@/types/database";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";

import { ActionFeedback } from "@/components/shared/action-feedback";
import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

interface LeadFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initialValues?: Partial<Tables<"leads">>;
  stageOptions: Array<{ id: string; name: string }>;
  advisorOptions: Array<{ id: string; label: string; role: string }>;
}

export function LeadForm({
  action,
  initialValues,
  stageOptions,
  advisorOptions,
}: LeadFormProps) {
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
          <FormField
            htmlFor="full_name"
            label="Nombre completo"
            error={state.fieldErrors?.full_name?.[0]}
          >
            <Input
              defaultValue={initialValues?.full_name ?? ""}
              id="full_name"
              name="full_name"
              required
            />
          </FormField>
          <FormField htmlFor="phone" label="Teléfono">
            <Input
              defaultValue={initialValues?.phone ?? ""}
              id="phone"
              name="phone"
            />
          </FormField>
          <FormField
            htmlFor="email"
            label="Email"
            error={state.fieldErrors?.email?.[0]}
          >
            <Input
              defaultValue={initialValues?.email ?? ""}
              id="email"
              name="email"
              type="email"
            />
          </FormField>
          <FormField htmlFor="source" label="Fuente">
            <Input
              defaultValue={initialValues?.source ?? ""}
              id="source"
              name="source"
            />
          </FormField>
          <FormField htmlFor="interest_type" label="Interés">
            <NativeSelect
              defaultValue={initialValues?.interest_type ?? ""}
              id="interest_type"
              name="interest_type"
            >
              <option value="">Sin definir</option>
              <option value="sale">Compra</option>
              <option value="rent">Alquiler</option>
            </NativeSelect>
          </FormField>
          <FormField htmlFor="qualification_status" label="Estado comercial">
            <NativeSelect
              defaultValue={initialValues?.qualification_status ?? "new"}
              id="qualification_status"
              name="qualification_status"
            >
              <option value="new">Nuevo</option>
              <option value="contacted">Contactado</option>
              <option value="qualified">Calificado</option>
              <option value="unqualified">No calificado</option>
              <option value="nurturing">Seguimiento</option>
              <option value="won">Ganado</option>
              <option value="lost">Perdido</option>
            </NativeSelect>
          </FormField>
          <FormField htmlFor="budget_min" label="Presupuesto mínimo">
            <Input
              defaultValue={initialValues?.budget_min ?? ""}
              id="budget_min"
              name="budget_min"
              type="number"
            />
          </FormField>
          <FormField htmlFor="budget_max" label="Presupuesto máximo">
            <Input
              defaultValue={initialValues?.budget_max ?? ""}
              id="budget_max"
              name="budget_max"
              type="number"
            />
          </FormField>
          <FormField htmlFor="desired_city" label="Ciudad buscada">
            <Input
              defaultValue={initialValues?.desired_city ?? ""}
              id="desired_city"
              name="desired_city"
            />
          </FormField>
          <FormField htmlFor="desired_neighborhood" label="Barrio buscado">
            <Input
              defaultValue={initialValues?.desired_neighborhood ?? ""}
              id="desired_neighborhood"
              name="desired_neighborhood"
            />
          </FormField>
          <FormField htmlFor="bedrooms_needed" label="Dormitorios necesarios">
            <Input
              defaultValue={initialValues?.bedrooms_needed ?? ""}
              id="bedrooms_needed"
              name="bedrooms_needed"
              type="number"
            />
          </FormField>
          <FormField htmlFor="score" label="Score">
            <Input
              defaultValue={initialValues?.score ?? ""}
              id="score"
              name="score"
              type="number"
            />
          </FormField>
          <FormField htmlFor="assigned_to" label="Asesor asignado">
            <NativeSelect
              defaultValue={initialValues?.assigned_to ?? ""}
              id="assigned_to"
              name="assigned_to"
            >
              <option value="">Sin asignar</option>
              {advisorOptions.map((advisor) => (
                <option key={advisor.id} value={advisor.id}>
                  {advisor.label} · {advisor.role}
                </option>
              ))}
            </NativeSelect>
          </FormField>
          <FormField htmlFor="pipeline_stage_id" label="Etapa pipeline">
            <NativeSelect
              defaultValue={initialValues?.pipeline_stage_id ?? ""}
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
          <FormField htmlFor="notes" label="Notas" className="md:col-span-2">
            <Textarea
              defaultValue={initialValues?.notes ?? ""}
              id="notes"
              name="notes"
            />
          </FormField>
          <div className="border-border grid gap-3 rounded-lg border bg-slate-50 p-4 md:col-span-2 md:grid-cols-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                defaultChecked={initialValues?.financing_needed ?? false}
                name="financing_needed"
                type="checkbox"
              />
              Requiere financiación
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                defaultChecked={initialValues?.pets ?? false}
                name="pets"
                type="checkbox"
              />
              Tiene mascotas
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                defaultChecked={
                  initialValues?.is_human_handoff_required ?? false
                }
                name="is_human_handoff_required"
                type="checkbox"
              />
              Derivación humana
            </label>
          </div>
        </CardContent>
      </Card>
      {state.message ? (
        <ActionFeedback message={state.message} status={state.status} />
      ) : null}
      <div className="flex justify-end">
        <SubmitButton label="Guardar lead" pendingLabel="Guardando lead..." />
      </div>
    </form>
  );
}
