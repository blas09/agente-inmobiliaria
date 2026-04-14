import { z } from "zod";

export const whatsappTemplateSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  language: z.string().min(2, "El idioma es obligatorio.").default("en_US"),
  category: z.string().optional().nullable(),
  status: z.string().min(1, "El estado es obligatorio.").default("approved"),
  is_active: z.boolean().default(true),
  components: z.array(z.unknown()).default([]),
});
