"use client";

import { useActionState } from "react";
import type { Tables } from "@/types/database";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";

import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface FaqFormProps {
	action: (state: ActionState, formData: FormData) => Promise<ActionState>;
	initialValues?: Partial<Tables<"faqs">>;
}

export function FaqForm({ action, initialValues }: FaqFormProps) {
	const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

	return (
		<form action={formAction} className="space-y-6">
			<Card>
				<CardContent className="grid gap-4 pt-6">
					<FormField
						htmlFor="question"
						label="Pregunta"
						error={state.fieldErrors?.question?.[0]}
					>
						<Input
							defaultValue={initialValues?.question ?? ""}
							id="question"
							name="question"
							required
						/>
					</FormField>
					<FormField htmlFor="category" label="Categoría">
						<Input defaultValue={initialValues?.category ?? ""} id="category" name="category" />
					</FormField>
					<FormField htmlFor="status" label="Estado">
						<Select defaultValue={initialValues?.status ?? "active"} id="status" name="status">
							<option value="active">Activa</option>
							<option value="inactive">Inactiva</option>
						</Select>
					</FormField>
					<FormField htmlFor="answer" label="Respuesta" error={state.fieldErrors?.answer?.[0]}>
						<Textarea defaultValue={initialValues?.answer ?? ""} id="answer" name="answer" required />
					</FormField>
				</CardContent>
			</Card>
			{state.message ? (
				<p className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
					{state.message}
				</p>
			) : null}
			<div className="flex justify-end">
				<SubmitButton label="Guardar FAQ" pendingLabel="Guardando FAQ..." />
			</div>
		</form>
	);
}
