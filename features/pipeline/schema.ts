import { z } from "zod";

export const pipelineStageSchema = z.object({
  name: z.string().min(2, "Ingresá un nombre"),
  position: z.number().int().min(1).max(99),
  category: z.enum([
    "inbox",
    "qualified",
    "visit",
    "negotiation",
    "won",
    "lost",
  ]),
  is_default: z.boolean(),
});
