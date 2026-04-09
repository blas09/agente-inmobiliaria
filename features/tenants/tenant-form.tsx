"use client";

import { useActionState } from "react";
import type { Tables } from "@/types/database";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";

import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface TenantFormProps {
	action: (state: ActionState, formData: FormData) => Promise<ActionState>;
	initialValues?: Partial<Tables<"tenants">>;
	showOwnerEmail?: boolean;
	showStatus?: boolean;
}

export function TenantForm({
	action,
	initialValues,
	showOwnerEmail = false,
	showStatus = true,
}: TenantFormProps) {
	const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

	return (
		<form action={formAction} className="space-y-6">
			<Card>
				<CardContent className="grid gap-4 pt-6 md:grid-cols-2">
					<FormField htmlFor="name" label="Nombre comercial" error={state.fieldErrors?.name?.[0]}>
						<Input defaultValue={initialValues?.name ?? ""} id="name" name="name" required />
					</FormField>
					<FormField htmlFor="slug" label="Slug" error={state.fieldErrors?.slug?.[0]}>
						<Input defaultValue={initialValues?.slug ?? ""} id="slug" name="slug" required />
					</FormField>
					{showStatus ? (
						<FormField htmlFor="status" label="Estado">
							<Select defaultValue={initialValues?.status ?? "trial"} id="status" name="status">
								<option value="trial">Trial</option>
								<option value="active">Activo</option>
								<option value="suspended">Suspendido</option>
								<option value="archived">Archivado</option>
							</Select>
						</FormField>
					) : (
						<input name="status" type="hidden" value={initialValues?.status ?? "active"} />
					)}
					<FormField htmlFor="primary_currency" label="Moneda principal">
						<Input
							defaultValue={initialValues?.primary_currency ?? "PYG"}
							id="primary_currency"
							name="primary_currency"
							required
						/>
					</FormField>
					<FormField htmlFor="timezone" label="Timezone">
						<Input
							defaultValue={initialValues?.timezone ?? "America/Asuncion"}
							id="timezone"
							name="timezone"
							required
						/>
					</FormField>
					<FormField htmlFor="locale" label="Locale">
						<Input defaultValue={initialValues?.locale ?? "es-PY"} id="locale" name="locale" required />
					</FormField>
					{showOwnerEmail ? (
						<FormField
							htmlFor="owner_email"
							label="Email del owner inicial"
							description="Debe existir como usuario registrado en la plataforma."
							error={state.fieldErrors?.owner_email?.[0]}
							className="md:col-span-2"
						>
							<Input id="owner_email" name="owner_email" type="email" required />
						</FormField>
					) : null}
				</CardContent>
			</Card>
			{state.message ? (
				<p
					className={`rounded-md px-3 py-2 text-sm ${
						state.status === "success"
							? "border border-emerald-200 bg-emerald-50 text-emerald-800"
							: "border border-destructive/20 bg-destructive/5 text-destructive"
					}`}
				>
					{state.message}
				</p>
			) : null}
			<div className="flex justify-end">
				<SubmitButton label="Guardar tenant" pendingLabel="Guardando tenant..." />
			</div>
		</form>
	);
}
