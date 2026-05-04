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
import { pipelineCategoryLabels } from "@/lib/ui-labels";

export function PipelineStageForm({
  action,
  initialValues,
  title,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initialValues?: {
    name: string;
    position: number;
    category: string;
    is_default: boolean;
  };
  title: string;
}) {
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Nombre, posición y categoría operativa dentro del pipeline.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4 lg:grid-cols-3">
          <FormField
            htmlFor={`name-${title}`}
            label="Nombre"
            error={state.fieldErrors?.name?.[0]}
          >
            <Input
              defaultValue={initialValues?.name ?? ""}
              id={`name-${title}`}
              name="name"
              required
            />
          </FormField>
          <FormField htmlFor={`position-${title}`} label="Posición">
            <Input
              defaultValue={initialValues?.position ?? 1}
              id={`position-${title}`}
              name="position"
              required
              type="number"
            />
          </FormField>
          <FormField htmlFor={`category-${title}`} label="Categoría">
            <NativeSelect
              defaultValue={initialValues?.category ?? "inbox"}
              id={`category-${title}`}
              name="category"
            >
              {Object.entries(pipelineCategoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          </FormField>
          <div className="flex flex-col gap-3 lg:col-span-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="border-border bg-card flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-sm">
              <input
                defaultChecked={initialValues?.is_default ?? false}
                name="is_default"
                type="checkbox"
              />
              Predeterminada
            </label>
            <SubmitButton label="Guardar" pendingLabel="Guardando..." />
          </div>
        </form>
        {state.message ? (
          <ActionFeedback
            className="mt-4"
            message={state.message}
            status={state.status}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
