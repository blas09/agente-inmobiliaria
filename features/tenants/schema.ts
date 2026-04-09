import { z } from "zod";

export const tenantSchema = z.object({
	name: z.string().min(3, "Ingresá un nombre comercial"),
	slug: z
		.string()
		.min(3, "Ingresá un slug")
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usá minúsculas, números y guiones"),
	status: z.enum(["trial", "active", "suspended", "archived"]),
	primary_currency: z.string().min(3).max(3),
	timezone: z.string().min(3, "Ingresá una timezone válida"),
	locale: z.string().min(2, "Ingresá un locale válido"),
	owner_email: z.string().email("Ingresá un email válido").optional().or(z.literal("")),
});

export const tenantMembershipSchema = z.object({
	email: z.string().email("Ingresá un email válido"),
	role: z.enum(["tenant_owner", "tenant_admin", "advisor", "operator", "viewer"]),
	status: z.enum(["active", "suspended", "removed"]),
});

