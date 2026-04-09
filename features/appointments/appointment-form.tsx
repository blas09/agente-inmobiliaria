"use client";

import { useActionState } from "react";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";

import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTimeLocalInput } from "@/lib/utils";

interface AppointmentFormProps {
	action: (state: ActionState, formData: FormData) => Promise<ActionState>;
	title: string;
	submitLabel: string;
	pendingLabel?: string;
	timezone: string;
	initialValues?: {
		scheduled_at?: string | null;
		status?: string;
		property_id?: string | null;
		advisor_id?: string | null;
		notes?: string | null;
	};
	advisorOptions: Array<{ id: string; label: string; role: string }>;
	propertyOptions: Array<{ id: string; label: string }>;
	rulesSummary?: string;
}

export function AppointmentForm({
	action,
	title,
	submitLabel,
	pendingLabel,
	timezone,
	initialValues,
	advisorOptions,
	propertyOptions,
	rulesSummary,
}: AppointmentFormProps) {
	const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<form action={formAction} className="space-y-4">
					{rulesSummary ? (
						<p className="rounded-md border border-border bg-slate-50 px-3 py-2 text-sm text-muted-foreground">
							Reglas activas: {rulesSummary}
						</p>
					) : null}
					<FormField
						htmlFor="scheduled_at"
						label="Fecha y hora"
						error={state.fieldErrors?.scheduled_at?.[0]}
						description={`Se interpreta en la timezone del tenant: ${timezone}.`}
					>
						<Input
							defaultValue={formatDateTimeLocalInput(initialValues?.scheduled_at, timezone)}
							id="scheduled_at"
							name="scheduled_at"
							type="datetime-local"
						/>
					</FormField>
					<FormField htmlFor="status" label="Estado" error={state.fieldErrors?.status?.[0]}>
						<Select defaultValue={initialValues?.status ?? "scheduled"} id="status" name="status">
							<option value="scheduled">Agendada</option>
							<option value="confirmed">Confirmada</option>
							<option value="completed">Completada</option>
							<option value="canceled">Cancelada</option>
							<option value="no_show">No asistió</option>
						</Select>
					</FormField>
					<FormField htmlFor="property_id" label="Propiedad" error={state.fieldErrors?.property_id?.[0]}>
						<Select defaultValue={initialValues?.property_id ?? ""} id="property_id" name="property_id">
							<option value="">Sin propiedad puntual</option>
							{propertyOptions.map((property) => (
								<option key={property.id} value={property.id}>
									{property.label}
								</option>
							))}
						</Select>
					</FormField>
					<FormField htmlFor="advisor_id" label="Asesor" error={state.fieldErrors?.advisor_id?.[0]}>
						<Select defaultValue={initialValues?.advisor_id ?? ""} id="advisor_id" name="advisor_id">
							<option value="">Sin asignar</option>
							{advisorOptions.map((advisor) => (
								<option key={advisor.id} value={advisor.id}>
									{advisor.label} · {advisor.role}
								</option>
							))}
						</Select>
					</FormField>
					<FormField htmlFor="notes" label="Notas">
						<Textarea defaultValue={initialValues?.notes ?? ""} id="notes" name="notes" />
					</FormField>
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
					<SubmitButton
						label={submitLabel}
						pendingLabel={pendingLabel ?? "Guardando visita..."}
					/>
				</form>
			</CardContent>
		</Card>
	);
}
