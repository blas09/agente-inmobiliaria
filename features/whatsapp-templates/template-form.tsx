"use client";

import { useActionState, useMemo, useState } from "react";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";
import { ActionFeedback } from "@/components/shared/action-feedback";
import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { whatsappTemplateStatusLabels } from "@/lib/ui-labels";

const statusOptions = Object.entries(whatsappTemplateStatusLabels);

const templateExamples = {
  simpleBody: JSON.stringify(
    [
      {
        type: "body",
        parameters: [{ type: "text", text: "Hola {{1}}" }],
      },
    ],
    null,
    2,
  ),
  headerBody: JSON.stringify(
    [
      {
        type: "header",
        parameters: [{ type: "text", text: "Visita confirmada" }],
      },
      {
        type: "body",
        parameters: [
          { type: "text", text: "Laura" },
          { type: "text", text: "mañana 10:00" },
        ],
      },
    ],
    null,
    2,
  ),
};

export function WhatsAppTemplateForm({
  action,
  variant = "card",
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  variant?: "card" | "flat";
}) {
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);
  const [components, setComponents] = useState("");

  const parsedPreview = useMemo(() => {
    if (!components.trim()) {
      return { valid: true as const, items: [] as unknown[] };
    }

    try {
      const parsed = JSON.parse(components);
      if (!Array.isArray(parsed)) {
        return {
          valid: false as const,
          error: "El JSON debe ser un array de componentes.",
        };
      }

      return { valid: true as const, items: parsed };
    } catch {
      return {
        valid: false as const,
        error: "El JSON no es válido.",
      };
    }
  }, [components]);

  const formContent = (
    <div className="space-y-4">
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
              {statusOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          </FormField>
        </div>
        <FormField
          htmlFor="components"
          label="Componentes (JSON)"
          description="Podés dejarlo vacío para plantillas simples o pegar un array JSON válido de Meta."
        >
          <Textarea
            id="components"
            name="components"
            placeholder='[{"type":"body","parameters":[{"type":"text","text":"Hola"}]}]'
            rows={4}
            value={components}
            onChange={(event) => setComponents(event.target.value)}
          />
        </FormField>
        <div className="flex flex-wrap gap-2">
          <button
            className="text-primary text-xs font-medium"
            onClick={() => setComponents(templateExamples.simpleBody)}
            type="button"
          >
            Cargar ejemplo simple
          </button>
          <button
            className="text-primary text-xs font-medium"
            onClick={() => setComponents(templateExamples.headerBody)}
            type="button"
          >
            Cargar ejemplo con header
          </button>
        </div>
        <div className="bg-muted rounded-md p-4 text-sm">
          <p className="font-medium">Preview de componentes</p>
          {!parsedPreview.valid ? (
            <p className="text-destructive mt-2 text-xs font-medium">
              {parsedPreview.error}
            </p>
          ) : parsedPreview.items.length === 0 ? (
            <p className="text-muted-foreground mt-2 text-sm">
              Sin componentes. La plantilla se guardará sin parámetros
              preconfigurados.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {parsedPreview.items.map((item, index) => {
                const component =
                  item && typeof item === "object"
                    ? (item as {
                        type?: string;
                        parameters?: Array<{ type?: string; text?: string }>;
                      })
                    : null;

                return (
                  <div
                    key={index}
                    className="border-border rounded-lg border px-3 py-2"
                  >
                    <p className="text-foreground text-xs font-medium tracking-[0.18em] uppercase">
                      {component?.type ?? `Componente ${index + 1}`}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {(component?.parameters ?? [])
                        .map(
                          (parameter) =>
                            parameter.text ?? parameter.type ?? "param",
                        )
                        .join(" · ") || "Sin parámetros visibles"}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end">
          <SubmitButton label="Guardar plantilla" pendingLabel="Guardando..." />
        </div>
      </form>
      {state.message ? (
        <ActionFeedback message={state.message} status={state.status} />
      ) : null}
    </div>
  );

  if (variant === "flat") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Nueva plantilla WhatsApp</h2>
          <p className="text-muted-foreground mt-2">
            Cargá una plantilla disponible para respuestas operativas por
            WhatsApp.
          </p>
        </div>
        {formContent}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva plantilla WhatsApp</CardTitle>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
