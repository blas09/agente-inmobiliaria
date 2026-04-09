"use client";

import { useActionState } from "react";
import type { Tables } from "@/types/database";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";

import { ActionFeedback } from "@/components/shared/action-feedback";
import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
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
				<CardHeader>
					<CardTitle>Contenido de la respuesta</CardTitle>
					<CardDescription>Pregunta, categoría y estado editorial de la FAQ.</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 md:grid-cols-2">
					<FormField
						htmlFor="question"
						label="Pregunta"
						error={state.fieldErrors?.question?.[0]}
						className="md:col-span-2"
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
						<NativeSelect defaultValue={initialValues?.status ?? "active"} id="status" name="status">
							<option value="active">Activa</option>
							<option value="inactive">Inactiva</option>
						</NativeSelect>
					</FormField>
					<FormField htmlFor="answer" label="Respuesta" error={state.fieldErrors?.answer?.[0]} className="md:col-span-2">
						<Textarea defaultValue={initialValues?.answer ?? ""} id="answer" name="answer" required />
					</FormField>
				</CardContent>
			</Card>
			{state.message ? <ActionFeedback message={state.message} status={state.status} /> : null}
			<div className="flex justify-end">
				<SubmitButton label="Guardar FAQ" pendingLabel="Guardando FAQ..." shape="pill" />
			</div>
		</form>
	);
}
