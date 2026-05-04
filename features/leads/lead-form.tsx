"use client";

import { useActionState } from "react";
import type { Tables } from "@/types/database";

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
import {
  getTenantRoleLabel,
  leadInterestTypeLabels,
  leadQualificationStatusLabels,
} from "@/lib/ui-labels";

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
        <CardHeader>
          <CardTitle>Contacto</CardTitle>
          <CardDescription>
            Datos mínimos para identificar y contactar al lead.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <FormField
            htmlFor="full_name"
            label="Nombre completo"
            error={state.fieldErrors?.full_name?.[0]}
            description="Campo requerido para identificar al contacto."
          >
            <Input
              defaultValue={initialValues?.full_name ?? ""}
              id="full_name"
              name="full_name"
              required
            />
          </FormField>
          <FormField
            htmlFor="phone"
            label="Teléfono"
            description="Principal para WhatsApp o coordinación comercial."
          >
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
            description="Opcional, pero útil para seguimiento formal."
          >
            <Input
              defaultValue={initialValues?.email ?? ""}
              id="email"
              name="email"
              type="email"
            />
          </FormField>
          <FormField
            htmlFor="source"
            label="Fuente"
            description="Origen del lead, por ejemplo web, referido o WhatsApp."
          >
            <Input
              defaultValue={initialValues?.source ?? ""}
              id="source"
              name="source"
            />
          </FormField>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Interés comercial</CardTitle>
          <CardDescription>
            Clasificación inicial para entender qué necesita el lead.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <FormField
            htmlFor="interest_type"
            label="Interés"
            description="Compra, alquiler u otro tipo de necesidad."
          >
            <NativeSelect
              defaultValue={initialValues?.interest_type ?? ""}
              id="interest_type"
              name="interest_type"
            >
              <option value="">Sin definir</option>
              {Object.entries(leadInterestTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          </FormField>
          <FormField
            htmlFor="qualification_status"
            label="Estado comercial"
            description="Estado operativo de calificación del lead."
          >
            <NativeSelect
              defaultValue={initialValues?.qualification_status ?? "new"}
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
          <FormField
            htmlFor="score"
            label="Score"
            description="Prioridad interna. Usá números más altos para leads más relevantes."
          >
            <Input
              defaultValue={initialValues?.score ?? ""}
              id="score"
              name="score"
              type="number"
            />
          </FormField>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Búsqueda</CardTitle>
          <CardDescription>
            Presupuesto, zona y requisitos para matchear propiedades.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
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
          <FormField
            htmlFor="bedrooms_needed"
            label="Dormitorios necesarios"
            description="Completá si el lead tiene un mínimo definido."
          >
            <Input
              defaultValue={initialValues?.bedrooms_needed ?? ""}
              id="bedrooms_needed"
              name="bedrooms_needed"
              type="number"
            />
          </FormField>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Routing</CardTitle>
          <CardDescription>
            Responsable y etapa del pipeline para dar seguimiento.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <FormField
            htmlFor="assigned_to"
            label="Asesor asignado"
            description="Responsable interno del seguimiento."
          >
            <NativeSelect
              defaultValue={initialValues?.assigned_to ?? ""}
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
          <FormField
            htmlFor="pipeline_stage_id"
            label="Etapa pipeline"
            description="Ubicación actual dentro del proceso comercial."
          >
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
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notas y preferencias</CardTitle>
          <CardDescription>
            Información adicional para calificar y atender el caso.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <FormField
            htmlFor="notes"
            label="Notas"
            description="Usá este campo para contexto comercial que no encaje en campos estructurados."
          >
            <Textarea
              className="min-h-32"
              defaultValue={initialValues?.notes ?? ""}
              id="notes"
              name="notes"
            />
          </FormField>
          <div className="border-border bg-lightprimary space-y-3 rounded-xl border p-5">
            <p className="text-foreground text-sm font-medium">
              Señales operativas
            </p>
            <p className="text-muted-foreground text-xs">
              Marcá condiciones que cambian la forma de priorizar o responder el
              caso.
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="border-border bg-card text-foreground flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                <input
                  defaultChecked={initialValues?.financing_needed ?? false}
                  name="financing_needed"
                  type="checkbox"
                />
                Requiere financiación
              </label>
              <label className="border-border bg-card text-foreground flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                <input
                  defaultChecked={initialValues?.pets ?? false}
                  name="pets"
                  type="checkbox"
                />
                Tiene mascotas
              </label>
              <label className="border-border bg-card text-foreground flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
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
