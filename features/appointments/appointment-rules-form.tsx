"use client";

import { useActionState } from "react";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";

import type { AppointmentRules, WorkingDay } from "@/features/appointments/rules";
import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Input } from "@/components/ui/input";

const workingDayOptions: Array<{ value: WorkingDay; label: string }> = [
	{ value: "monday", label: "Lunes" },
	{ value: "tuesday", label: "Martes" },
	{ value: "wednesday", label: "Miércoles" },
	{ value: "thursday", label: "Jueves" },
	{ value: "friday", label: "Viernes" },
	{ value: "saturday", label: "Sábado" },
	{ value: "sunday", label: "Domingo" },
];

interface AppointmentRulesFormProps {
	action: (state: ActionState, formData: FormData) => Promise<ActionState>;
	initialValues: AppointmentRules;
	timezone: string;
}

export function AppointmentRulesForm({
	action,
	initialValues,
	timezone,
}: AppointmentRulesFormProps) {
	const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

	return (
		<form action={formAction} className="space-y-4">
			<p className="text-sm text-muted-foreground">
				Estas reglas se interpretan en la timezone del tenant: {timezone}.
			</p>
			<div className="grid gap-4 md:grid-cols-3">
				<FormField
					htmlFor="default_duration_minutes"
					label="Duración por defecto"
					error={state.fieldErrors?.default_duration_minutes?.[0]}
				>
					<Input
						defaultValue={initialValues.default_duration_minutes}
						id="default_duration_minutes"
						min={15}
						name="default_duration_minutes"
						step={15}
						type="number"
					/>
				</FormField>
				<FormField
					htmlFor="buffer_minutes"
					label="Buffer entre visitas"
					error={state.fieldErrors?.buffer_minutes?.[0]}
				>
					<Input
						defaultValue={initialValues.buffer_minutes}
						id="buffer_minutes"
						min={0}
						name="buffer_minutes"
						step={5}
						type="number"
					/>
				</FormField>
				<FormField
					htmlFor="advance_notice_hours"
					label="Aviso mínimo"
					error={state.fieldErrors?.advance_notice_hours?.[0]}
				>
					<Input
						defaultValue={initialValues.advance_notice_hours}
						id="advance_notice_hours"
						min={0}
						name="advance_notice_hours"
						step={1}
						type="number"
					/>
				</FormField>
				<FormField
					htmlFor="business_hours_start"
					label="Desde"
					error={state.fieldErrors?.business_hours_start?.[0]}
				>
					<Input
						defaultValue={initialValues.business_hours_start}
						id="business_hours_start"
						name="business_hours_start"
						type="time"
					/>
				</FormField>
				<FormField
					htmlFor="business_hours_end"
					label="Hasta"
					error={state.fieldErrors?.business_hours_end?.[0]}
				>
					<Input
						defaultValue={initialValues.business_hours_end}
						id="business_hours_end"
						name="business_hours_end"
						type="time"
					/>
				</FormField>
			</div>
			<FormField
				htmlFor="working_days"
				label="Días hábiles"
				error={state.fieldErrors?.working_days?.[0]}
			>
				<div className="flex flex-wrap gap-3">
					{workingDayOptions.map((option) => (
						<label
							key={option.value}
							className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
						>
							<input
								defaultChecked={initialValues.working_days.includes(option.value)}
								name="working_days"
								type="checkbox"
								value={option.value}
							/>
							{option.label}
						</label>
					))}
				</div>
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
			<div className="flex justify-end">
				<SubmitButton label="Guardar reglas de agenda" pendingLabel="Guardando reglas..." />
			</div>
		</form>
	);
}
