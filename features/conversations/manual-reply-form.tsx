"use client";

import { useActionState, useMemo, useState } from "react";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";

import { ActionFeedback } from "@/components/shared/action-feedback";
import { SubmitButton } from "@/components/shared/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { getWhatsAppTemplateCategoryLabel } from "@/lib/ui-labels";
import { Badge } from "@/components/ui/badge";
import type { Json } from "@/types/database";

export function ManualReplyForm({
  action,
  templates,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  templates: Array<{
    id: string;
    name: string;
    language: string;
    category: string | null;
    components?: Json;
  }>;
}) {
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [templateComponents, setTemplateComponents] = useState("");

  const selectedTemplate =
    templates.find((template) => template.id === selectedTemplateId) ?? null;

  const defaultTemplateComponents = useMemo(() => {
    if (!selectedTemplate?.components) return "";
    return JSON.stringify(selectedTemplate.components, null, 2);
  }, [selectedTemplate]);

  const parsedPreview = useMemo(() => {
    const raw = templateComponents.trim() || defaultTemplateComponents.trim();

    if (!raw) {
      return { valid: true as const, items: [] as unknown[] };
    }

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return {
          valid: false as const,
          error: "Los componentes deben ser un array JSON válido.",
        };
      }

      return { valid: true as const, items: parsed };
    } catch {
      return {
        valid: false as const,
        error: "Los componentes no tienen un JSON válido.",
      };
    }
  }, [defaultTemplateComponents, templateComponents]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Respuesta manual</CardTitle>
        <CardDescription>
          Enviá una respuesta libre o una plantilla aprobada por WhatsApp.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {templates.length > 0 ? (
            <FormField htmlFor="template_id" label="Plantilla">
              <NativeSelect
                id="template_id"
                name="template_id"
                defaultValue=""
                onChange={(event) => {
                  const nextId = event.target.value;
                  setSelectedTemplateId(nextId);
                  setTemplateComponents("");
                }}
              >
                <option value="">Sin plantilla (texto libre)</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} · {template.language}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
          ) : null}
          {selectedTemplate ? (
            <div className="border-border bg-muted space-y-3 rounded-xl border p-4 text-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{selectedTemplate.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {selectedTemplate.language}
                    {selectedTemplate.category
                      ? ` · ${getWhatsAppTemplateCategoryLabel(
                          selectedTemplate.category,
                        )}`
                      : ""}
                  </p>
                </div>
                <Badge variant="lightPrimary">Plantilla</Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                Podés usar los componentes por defecto de la plantilla o
                sobreescribirlos pegando un JSON válido abajo.
              </p>
            </div>
          ) : null}
          <FormField
            htmlFor="template_components"
            label="Componentes (JSON)"
            description={
              selectedTemplate
                ? "Si lo dejás vacío, se usan los componentes guardados en la plantilla."
                : "Opcional. Solo hace falta si vas a enviar una plantilla."
            }
          >
            <Textarea
              id="template_components"
              name="template_components"
              placeholder='[{"type":"body","parameters":[{"type":"text","text":"Hola"}]}]'
              rows={3}
              value={templateComponents}
              onChange={(event) => setTemplateComponents(event.target.value)}
            />
          </FormField>
          {selectedTemplate && defaultTemplateComponents ? (
            <div className="border-border rounded-xl border p-4 text-sm">
              <p className="font-medium">Componentes por defecto</p>
              <pre className="text-muted-foreground mt-2 overflow-x-auto text-xs whitespace-pre-wrap">
                {defaultTemplateComponents}
              </pre>
            </div>
          ) : null}
          {selectedTemplate ? (
            <div className="border-border bg-muted rounded-xl border p-4 text-sm">
              <p className="font-medium">Preview de parámetros</p>
              {!parsedPreview.valid ? (
                <p className="text-destructive mt-2 text-xs font-medium">
                  {parsedPreview.error}
                </p>
              ) : parsedPreview.items.length === 0 ? (
                <p className="text-muted-foreground mt-2 text-sm">
                  Esta plantilla no tiene parámetros visibles configurados.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {parsedPreview.items.map((item, index) => {
                    const component =
                      item && typeof item === "object"
                        ? (item as {
                            type?: string;
                            parameters?: Array<{
                              type?: string;
                              text?: string;
                            }>;
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
          ) : null}
          <Textarea
            name="content"
            placeholder="Escribí la respuesta que querés enviar por WhatsApp..."
          />
          {state.message ? (
            <ActionFeedback message={state.message} status={state.status} />
          ) : null}
          <div className="flex justify-end">
            <SubmitButton
              label="Enviar por WhatsApp"
              pendingLabel="Enviando..."
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
