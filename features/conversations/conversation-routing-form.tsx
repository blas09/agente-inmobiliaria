"use client";

import { useActionState } from "react";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";

import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ConversationRoutingFormProps {
	action: (state: ActionState, formData: FormData) => Promise<ActionState>;
	initialValues: {
		assigned_to: string | null;
		status: string;
		handoff_reason: string | null;
		ai_enabled: boolean;
	};
	advisorOptions: Array<{ id: string; label: string; role: string }>;
}

export function ConversationRoutingForm({
	action,
	initialValues,
	advisorOptions,
}: ConversationRoutingFormProps) {
	const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Routing y handoff</CardTitle>
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
					<FormField htmlFor="status" label="Estado">
						<Select defaultValue={initialValues.status} id="status" name="status">
							<option value="open">Abierta</option>
							<option value="pending_human">Pendiente humano</option>
							<option value="automated">Automatizada</option>
							<option value="closed">Cerrada</option>
						</Select>
					</FormField>
					<FormField htmlFor="handoff_reason" label="Motivo de handoff">
						<Textarea
							defaultValue={initialValues.handoff_reason ?? ""}
							id="handoff_reason"
							name="handoff_reason"
						/>
					</FormField>
					<label className="flex items-center gap-2 text-sm">
						<input defaultChecked={initialValues.ai_enabled} name="ai_enabled" type="checkbox" />
						IA habilitada en esta conversación
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
					<SubmitButton label="Actualizar conversación" pendingLabel="Guardando..." />
				</form>
			</CardContent>
		</Card>
	);
}
