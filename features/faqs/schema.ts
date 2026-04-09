import { z } from "zod";

export const faqSchema = z.object({
	question: z.string().min(5, "Ingresá una pregunta más clara"),
	answer: z.string().min(10, "La respuesta necesita más detalle"),
	category: z.string().optional(),
	status: z.enum(["active", "inactive"]),
});

