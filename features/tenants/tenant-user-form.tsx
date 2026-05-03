"use client";

import { useActionState } from "react";
import type { TenantRole } from "@/types/database";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";
import type { TenantUserSummary } from "@/server/queries/tenants";

import { ActionFeedback } from "@/components/shared/action-feedback";
import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";

const roleOptions: Array<{ value: TenantRole; label: string }> = [
  { value: "tenant_owner", label: "Propietario" },
  { value: "tenant_admin", label: "Administrador" },
  { value: "advisor", label: "Asesor" },
  { value: "operator", label: "Operador" },
  { value: "viewer", label: "Lectura" },
];

const statusOptions = [
  { value: "invited", label: "Invitado" },
  { value: "active", label: "Activo" },
  { value: "suspended", label: "Suspendido" },
  { value: "removed", label: "Removido" },
];

const roleLabelByValue = new Map(
  roleOptions.map((option) => [option.value, option.label]),
);
const statusLabelByValue = new Map(
  statusOptions.map((option) => [option.value, option.label]),
);

export function getTenantRoleLabel(role: TenantRole) {
  return roleLabelByValue.get(role) ?? role;
}

export function AddTenantUserForm({
  action,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar miembro</CardTitle>
        <CardDescription>
          Si el email ya existe, se activa en el tenant. Si no existe, se envía
          una invitación y queda como invitado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={formAction}
          className="grid gap-4 md:grid-cols-[1.6fr_1fr_auto]"
        >
          <FormField
            htmlFor="email"
            label="Email"
            error={state.fieldErrors?.email?.[0]}
          >
            <Input
              id="email"
              name="email"
              placeholder="asesor@empresa.com"
              required
              type="email"
            />
          </FormField>
          <FormField htmlFor="role" label="Rol">
            <NativeSelect defaultValue="advisor" id="role" name="role">
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>
          </FormField>
          <div className="flex items-end">
            <SubmitButton
              label="Agregar"
              pendingLabel="Guardando..."
              shape="pill"
            />
          </div>
        </form>
        {state.message ? (
          <ActionFeedback
            className="mt-4"
            message={state.message}
            status={state.status}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}

export function TenantUsersList({
  users,
  action,
}: {
  users: TenantUserSummary[];
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <TenantUserRow key={user.id} action={action} user={user} />
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
      <CardContent>
        <form
          action={formAction}
          className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr_auto]"
        >
          <input name="member_id" type="hidden" value={user.id} />
          <div className="border-border bg-muted space-y-2 rounded-xl border p-4">
            <p className="font-medium">
              {user.user_profiles?.full_name ?? "Perfil sin sincronizar"}
            </p>
            <p className="text-muted-foreground text-sm">
              {user.user_profiles?.email ?? user.user_id}
            </p>
            <Badge className="w-fit" variant="lightPrimary">
              {statusLabelByValue.get(user.status) ?? user.status}
            </Badge>
          </div>
          <input
            name="email"
            type="hidden"
            value={user.user_profiles?.email ?? "placeholder@example.com"}
          />
          <FormField htmlFor={`role-${user.id}`} label="Rol">
            <NativeSelect
              defaultValue={user.role}
              id={`role-${user.id}`}
              name="role"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>
          </FormField>
          <FormField htmlFor={`status-${user.id}`} label="Estado">
            <NativeSelect
              defaultValue={user.status}
              id={`status-${user.id}`}
              name="status"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>
          </FormField>
          <div className="flex items-end">
            <SubmitButton
              label="Actualizar"
              pendingLabel="Guardando..."
              shape="pill"
            />
          </div>
        </form>
        {state.message ? (
          <ActionFeedback
            className="mt-4"
            message={state.message}
            status={state.status}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
