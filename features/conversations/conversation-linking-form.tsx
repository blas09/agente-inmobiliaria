"use client";

import { useActionState } from "react";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";

import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

interface ConversationLinkingFormProps {
	action: (state: ActionState, formData: FormData) => Promise<ActionState>;
	initialValues: {
		lead_id: string | null;
		property_id: string | null;
	};
	leadOptions: Array<{ id: string; label: string }>;
	propertyOptions: Array<{ id: string; label: string }>;
}

export function ConversationLinkingForm({
	action,
	initialValues,
	leadOptions,
	propertyOptions,
}: ConversationLinkingFormProps) {
	const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Vínculos operativos</CardTitle>
			</CardHeader>
			<CardContent>
				<form action={formAction} className="space-y-4">
					<FormField htmlFor="lead_id" label="Lead asociado">
						<Select defaultValue={initialValues.lead_id ?? ""} id="lead_id" name="lead_id">
							<option value="">Sin lead</option>
							{leadOptions.map((lead) => (
								<option key={lead.id} value={lead.id}>
									{lead.label}
								</option>
							))}
						</Select>
					</FormField>
					<FormField htmlFor="property_id" label="Propiedad asociada">
						<Select defaultValue={initialValues.property_id ?? ""} id="property_id" name="property_id">
							<option value="">Sin propiedad</option>
							{propertyOptions.map((property) => (
								<option key={property.id} value={property.id}>
									{property.label}
								</option>
							))}
						</Select>
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
					<SubmitButton label="Actualizar vínculos" pendingLabel="Guardando..." />
				</form>
			</CardContent>
		</Card>
	);
}

