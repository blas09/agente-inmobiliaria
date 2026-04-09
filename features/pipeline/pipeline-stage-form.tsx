"use client";

import { useActionState } from "react";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";

import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function PipelineStageForm({
	action,
	initialValues,
	title,
}: {
	action: (state: ActionState, formData: FormData) => Promise<ActionState>;
	initialValues?: {
		name: string;
		position: number;
		category: string;
		is_default: boolean;
	};
	title: string;
}) {
	const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<form action={formAction} className="grid gap-4 md:grid-cols-[1.3fr_0.7fr_1fr_auto]">
					<FormField htmlFor={`name-${title}`} label="Nombre" error={state.fieldErrors?.name?.[0]}>
						<Input defaultValue={initialValues?.name ?? ""} id={`name-${title}`} name="name" required />
					</FormField>
					<FormField htmlFor={`position-${title}`} label="Posición">
						<Input
							defaultValue={initialValues?.position ?? 1}
							id={`position-${title}`}
							name="position"
							required
							type="number"
						/>
					</FormField>
					<FormField htmlFor={`category-${title}`} label="Categoría">
						<Select defaultValue={initialValues?.category ?? "inbox"} id={`category-${title}`} name="category">
							<option value="inbox">Inbox</option>
							<option value="qualified">Qualified</option>
							<option value="visit">Visit</option>
							<option value="negotiation">Negotiation</option>
							<option value="won">Won</option>
							<option value="lost">Lost</option>
						</Select>
					</FormField>
					<div className="flex items-end gap-3">
						<label className="flex items-center gap-2 text-sm">
							<input defaultChecked={initialValues?.is_default ?? false} name="is_default" type="checkbox" />
							Default
						</label>
						<SubmitButton label="Guardar" pendingLabel="Guardando..." />
					</div>
				</form>
				{state.message ? (
					<p
						className={`mt-4 rounded-md px-3 py-2 text-sm ${
							state.status === "success"
								? "border border-emerald-200 bg-emerald-50 text-emerald-800"
								: "border border-destructive/20 bg-destructive/5 text-destructive"
						}`}
					>
						{state.message}
					</p>
				) : null}
			</CardContent>
		</Card>
	);
}
