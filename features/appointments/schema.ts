import { z } from "zod";

export const appointmentSchema = z.object({
	scheduled_at: z.string().min(16, "Ingresá fecha y hora para la visita."),
	status: z.enum(["scheduled", "confirmed", "completed", "canceled", "no_show"]),
	property_id: z.string().uuid().nullable(),
	advisor_id: z.string().uuid().nullable(),
	notes: z.string().optional(),
});
