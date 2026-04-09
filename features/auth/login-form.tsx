"use client";
import { useActionState } from "react";

import { INITIAL_ACTION_STATE } from "@/types/actions";
import { signInAction } from "@/features/auth/actions";

import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LoginForm() {
	const [state, formAction] = useActionState(signInAction, INITIAL_ACTION_STATE);

	return (
		<Card className="w-full max-w-md border-white/10 bg-white/95 shadow-2xl shadow-teal-950/10">
			<CardHeader className="space-y-2">
				<p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
					Fase 0 · Foundation
				</p>
				<CardTitle className="text-2xl">Ingresar al dashboard</CardTitle>
				<CardDescription>
					Entrá con un usuario autenticado de Supabase. Los seeds dejan credenciales de
					desarrollo listas.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={formAction} className="space-y-4">
					<FormField htmlFor="email" label="Email">
						<Input id="email" name="email" placeholder="owner@demo.py" required type="email" />
					</FormField>
					<FormField htmlFor="password" label="Contraseña">
						<Input id="password" name="password" required type="password" />
					</FormField>
					{state.message ? (
						<p className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
							{state.message}
						</p>
					) : null}
					<SubmitButton className="w-full" label="Ingresar" pendingLabel="Validando..." />
				</form>
				<div className="mt-6 rounded-lg border border-dashed border-border bg-slate-50 p-4 text-sm text-muted-foreground">
					<p className="font-medium text-slate-900">Credenciales seed</p>
					<p>`owner@demo.py` / `Password123!`</p>
					<p>`advisor@demo.py` / `Password123!`</p>
					<p className="mt-2">La guía de setup y Supabase está documentada en el README del proyecto.</p>
				</div>
			</CardContent>
		</Card>
	);
}
