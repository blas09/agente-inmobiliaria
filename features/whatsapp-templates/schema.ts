import { z } from "zod";

const templateParameterSchema = z
  .object({
    type: z.string().min(1, "El parámetro debe indicar un tipo."),
    text: z.string().optional(),
    payload: z.string().optional(),
  })
  .passthrough()
  .superRefine((value, ctx) => {
    if (value.type === "text" && (!value.text || value.text.trim().length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Los parámetros de tipo text requieren un valor en text.",
        path: ["text"],
      });
    }

    if (
      value.type === "payload" &&
      (!value.payload || value.payload.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Los parámetros de tipo payload requieren un valor en payload.",
        path: ["payload"],
      });
    }
  });

const templateComponentSchema = z
  .object({
    type: z.enum(["body", "header", "button"], {
      message: "El tipo de componente debe ser body, header o button.",
    }),
    sub_type: z.string().optional(),
    index: z.union([z.string(), z.number()]).optional(),
    parameters: z.array(templateParameterSchema).default([]),
  })
  .passthrough()
  .superRefine((value, ctx) => {
    if (value.type === "button" && (!value.sub_type || value.sub_type.trim().length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Los componentes button requieren sub_type.",
        path: ["sub_type"],
      });
    }
  });

export const whatsappTemplateComponentsSchema = z.array(templateComponentSchema);

export const whatsappTemplateSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  language: z.string().min(2, "El idioma es obligatorio.").default("en_US"),
  category: z.string().optional().nullable(),
  status: z.string().min(1, "El estado es obligatorio.").default("approved"),
  is_active: z.boolean().default(true),
  components: whatsappTemplateComponentsSchema.default([]),
});

export function parseWhatsAppTemplateComponents(value: unknown) {
  return whatsappTemplateComponentsSchema.safeParse(value);
}
