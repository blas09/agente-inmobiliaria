"use client";

import { useActionState } from "react";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";

import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

interface LeadRoutingFormProps {
	action: (state: ActionState, formData: FormData) => Promise<ActionState>;
	initialValues: {
		assigned_to: string | null;
		pipeline_stage_id: string | null;
		qualification_status: string;
		is_human_handoff_required: boolean;
	};
	stageOptions: Array<{ id: string; name: string }>;
	advisorOptions: Array<{ id: string; label: string; role: string }>;
}

export function LeadRoutingForm({
	action,
	initialValues,
	stageOptions,
	advisorOptions,
}: LeadRoutingFormProps) {
	const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Operación comercial</CardTitle>
			</CardHeader>
			<CardContent>
				<form action={formAction} className="space-y-4">
					<FormField htmlFor="assigned_to" label="Asesor asignado">
						<Select defaultValue={initialValues.assigned_to ?? ""} id="assigned_to" name="assigned_to">
							<option value="">Sin asignar</option>
							{advisorOptions.map((advisor) => (
								<option key={advisor.id} value={advisor.id}>
									{advisor.label} · {advisor.role}
								</option>
							))}
						</Select>
					</FormField>
					<FormField htmlFor="qualification_status" label="Estado comercial">
						<Select
							defaultValue={initialValues.qualification_status}
							id="qualification_status"
							name="qualification_status"
						>
							<option value="new">Nuevo</option>
							<option value="contacted">Contactado</option>
							<option value="qualified">Calificado</option>
							<option value="unqualified">No calificado</option>
							<option value="nurturing">Seguimiento</option>
							<option value="won">Ganado</option>
							<option value="lost">Perdido</option>
						</Select>
					</FormField>
					<FormField htmlFor="pipeline_stage_id" label="Etapa del pipeline">
						<Select
							defaultValue={initialValues.pipeline_stage_id ?? ""}
							id="pipeline_stage_id"
							name="pipeline_stage_id"
						>
							<option value="">Sin etapa</option>
							{stageOptions.map((stage) => (
								<option key={stage.id} value={stage.id}>
									{stage.name}
								</option>
							))}
						</Select>
					</FormField>
					<label className="flex items-center gap-2 text-sm">
						<input
							defaultChecked={initialValues.is_human_handoff_required}
							name="is_human_handoff_required"
							type="checkbox"
						/>
						Requiere derivación humana
					</label>
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
					<SubmitButton label="Actualizar operación" pendingLabel="Guardando..." />
				</form>
			</CardContent>
		</Card>
	);
}

