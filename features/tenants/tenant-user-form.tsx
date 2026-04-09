"use client";

import { useActionState } from "react";
import type { TenantRole } from "@/types/database";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";
import type { TenantUserSummary } from "@/server/queries/tenants";

import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const roleOptions: Array<{ value: TenantRole; label: string }> = [
	{ value: "tenant_owner", label: "Owner" },
	{ value: "tenant_admin", label: "Admin" },
	{ value: "advisor", label: "Advisor" },
	{ value: "operator", label: "Operator" },
	{ value: "viewer", label: "Viewer" },
];

const statusOptions = [
	{ value: "active", label: "Activo" },
	{ value: "suspended", label: "Suspendido" },
	{ value: "removed", label: "Removido" },
];

export function AddTenantUserForm({
	action,
}: {
	action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}) {
	const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Agregar miembro</CardTitle>
			</CardHeader>
			<CardContent>
				<form action={formAction} className="grid gap-4 md:grid-cols-[1.6fr_1fr_1fr_auto]">
					<FormField htmlFor="email" label="Email" error={state.fieldErrors?.email?.[0]}>
						<Input id="email" name="email" placeholder="asesor@empresa.com" required type="email" />
					</FormField>
					<FormField htmlFor="role" label="Rol">
						<Select defaultValue="advisor" id="role" name="role">
							{roleOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</Select>
					</FormField>
					<FormField htmlFor="status" label="Estado">
						<Select defaultValue="active" id="status" name="status">
							{statusOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</Select>
					</FormField>
					<div className="flex items-end">
						<SubmitButton label="Agregar" pendingLabel="Guardando..." />
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

export function TenantUsersList({
	users,
	actionFactory,
}: {
	users: TenantUserSummary[];
	actionFactory: (memberId: string) => (state: ActionState, formData: FormData) => Promise<ActionState>;
}) {
	return (
		<div className="space-y-4">
			{users.map((user) => (
				<TenantUserRow key={user.id} action={actionFactory(user.id)} user={user} />
			))}
		</div>
	);
}

function TenantUserRow({
	user,
	action,
}: {
	user: TenantUserSummary;
	action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}) {
	const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

	return (
		<Card>
			<CardContent className="pt-6">
				<form action={formAction} className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr_auto]">
					<div className="space-y-1">
						<p className="font-medium">{user.user_profiles?.full_name ?? "Perfil sin sincronizar"}</p>
						<p className="text-sm text-muted-foreground">
							{user.user_profiles?.email ?? user.user_id}
						</p>
						<Badge className="w-fit" variant="outline">
							{user.status}
						</Badge>
					</div>
					<input name="email" type="hidden" value={user.user_profiles?.email ?? "placeholder@example.com"} />
					<FormField htmlFor={`role-${user.id}`} label="Rol">
						<Select defaultValue={user.role} id={`role-${user.id}`} name="role">
							{roleOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</Select>
					</FormField>
					<FormField htmlFor={`status-${user.id}`} label="Estado">
						<Select defaultValue={user.status} id={`status-${user.id}`} name="status">
							{statusOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</Select>
					</FormField>
					<div className="flex items-end">
						<SubmitButton label="Actualizar" pendingLabel="Guardando..." />
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

