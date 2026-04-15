"use client";
import { useActionState } from "react";

import { INITIAL_ACTION_STATE } from "@/types/actions";
import { signInAction } from "@/features/auth/actions";

import { ActionFeedback } from "@/components/shared/action-feedback";
import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [state, formAction] = useActionState(
    signInAction,
    INITIAL_ACTION_STATE,
  );

  return (
    <Card className="w-full max-w-md p-8">
      <CardHeader className="space-y-3">
        <p className="text-primary/80 text-xs font-semibold tracking-[0.22em] uppercase">
          Workspace access
        </p>
        <CardTitle className="text-[2rem]">Ingresar al dashboard</CardTitle>
        <CardDescription>
          Entrá con un usuario autenticado de Supabase. Los seeds dejan
          credenciales de desarrollo listas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <FormField htmlFor="email" label="Email">
            <Input
              id="email"
              name="email"
              placeholder="owner@demo.py"
              required
              type="email"
            />
          </FormField>
          <FormField htmlFor="password" label="Contraseña">
            <Input id="password" name="password" required type="password" />
          </FormField>
          {state.message ? (
            <ActionFeedback message={state.message} status={state.status} />
          ) : null}
          <SubmitButton
            className="w-full"
            label="Ingresar"
            pendingLabel="Validando..."
            shape="pill"
          />
        </form>
        <div className="border-border bg-muted text-muted-foreground mt-6 rounded-2xl border border-dashed p-4 text-sm">
          <p className="text-foreground font-medium">Credenciales seed</p>
          <p>`owner@demo.py` / `Password123!`</p>
          <p>`tenantadmin@demo.py` / `Password123!`</p>
          <p>`advisor@demo.py` / `Password123!`</p>
          <p>`operator@demo.py` / `Password123!`</p>
          <p>`viewer@demo.py` / `Password123!`</p>
          <p>`admin@platform.local` / `Password123!`</p>
          <p className="mt-2">
            La guía de setup y Supabase está documentada en el README del
            proyecto.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
