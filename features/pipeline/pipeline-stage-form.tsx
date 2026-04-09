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
        <form
          action={formAction}
          className="grid gap-4 md:grid-cols-[1.3fr_0.7fr_1fr_auto]"
        >
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
              <option value="inbox">Inbox</option>
              <option value="qualified">Qualified</option>
              <option value="visit">Visit</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </NativeSelect>
          </FormField>
          <div className="flex items-end gap-3">
            <label className="border-border bg-card flex items-center gap-2 rounded-full border px-3 py-2 text-sm">
              <input
                defaultChecked={initialValues?.is_default ?? false}
                name="is_default"
                type="checkbox"
              />
              Default
            </label>
            <SubmitButton
              label="Guardar"
              pendingLabel="Guardando..."
              shape="pill"
            />
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
