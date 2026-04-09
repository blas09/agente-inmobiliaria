"use client";

import { useActionState } from "react";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";

import { ActionFeedback } from "@/components/shared/action-feedback";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function ManualReplyForm({
	action,
}: {
	action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}) {
	const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Respuesta manual</CardTitle>
			</CardHeader>
			<CardContent>
				<form action={formAction} className="space-y-4">
					<Textarea
						name="content"
						placeholder="Escribí la respuesta que querés enviar por WhatsApp..."
						required
					/>
					{state.message ? <ActionFeedback message={state.message} status={state.status} /> : null}
					<div className="flex justify-end">
						<SubmitButton label="Enviar por WhatsApp" pendingLabel="Enviando..." />
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
