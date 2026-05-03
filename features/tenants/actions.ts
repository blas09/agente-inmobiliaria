"use server";

import { cookies } from "next/headers";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ACTIVE_TENANT_COOKIE } from "@/server/auth/constants";
import {
  getTenantMemberships,
  requirePlatformAdmin,
  requireTenantAdminContext,
} from "@/server/auth/tenant-context";
import { getUserProfileByEmail } from "@/server/queries/tenants";
import type { ActionState } from "@/types/actions";
import {
  tenantMembershipSchema,
  tenantSchema,
} from "@/features/tenants/schema";

export async function switchActiveTenantAction(formData: FormData) {
  const tenantId = formData.get("tenantId")?.toString();
  const memberships = await getTenantMemberships();

  if (
    !tenantId ||
    !memberships.some((membership) => membership.tenant.id === tenantId)
  ) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_TENANT_COOKIE, tenantId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  revalidatePath("/dashboard", "layout");
}

function parseTenantFormData(formData: FormData) {
  return tenantSchema.safeParse({
    name: formData.get("name")?.toString().trim() ?? "",
    slug: formData.get("slug")?.toString().trim() ?? "",
    status: formData.get("status"),
    primary_currency:
      formData.get("primary_currency")?.toString().trim() ?? "PYG",
    timezone: formData.get("timezone")?.toString().trim() ?? "",
    locale: formData.get("locale")?.toString().trim() ?? "",
    owner_email:
      formData.get("owner_email")?.toString().trim().toLowerCase() ?? "",
  });
}

export async function createTenantAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePlatformAdmin();
  const supabase = await createSupabaseServerClient();
  const result = parseTenantFormData(formData);

  if (!result.success) {
    return {
      status: "error",
      message: "Hay campos inválidos en el tenant.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const ownerEmail = result.data.owner_email || "";
  if (!ownerEmail) {
    return {
      status: "error",
      message: "Definí un owner inicial con un usuario ya existente.",
    };
  }

  const ownerProfile = await getUserProfileByEmail(ownerEmail);
  if (!ownerProfile) {
    return {
      status: "error",
      message: "No existe un usuario registrado con ese email.",
    };
  }

  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .insert({
      name: result.data.name,
      slug: result.data.slug,
      status: result.data.status,
      primary_currency: result.data.primary_currency,
      timezone: result.data.timezone,
      locale: result.data.locale,
    })
    .select("*")
    .single();

  if (tenantError || !tenant) {
    return {
      status: "error",
      message: tenantError?.message ?? "No se pudo crear el tenant.",
    };
  }

  const { error: membershipError } = await supabase
    .from("tenant_users")
    .insert({
      tenant_id: tenant.id,
      user_id: ownerProfile.id,
      role: "tenant_owner",
      status: "active",
    });

  if (membershipError) {
    return {
      status: "error",
      message: `Tenant creado, pero falló la asignación del owner: ${membershipError.message}`,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/platform/tenants");
  redirect(`/dashboard/platform/tenants/${tenant.id}/edit`);
}

export async function updatePlatformTenantAction(
  tenantId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePlatformAdmin();
  const supabase = await createSupabaseServerClient();
  const result = parseTenantFormData(formData);

  if (!result.success) {
    return {
      status: "error",
      message: "Hay campos inválidos en el tenant.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("tenants")
    .update({
      name: result.data.name,
      slug: result.data.slug,
      status: result.data.status,
      primary_currency: result.data.primary_currency,
      timezone: result.data.timezone,
      locale: result.data.locale,
    })
    .eq("id", tenantId);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidatePath("/dashboard/platform/tenants");
  revalidatePath(`/dashboard/platform/tenants/${tenantId}/edit`);
  return { status: "success", message: "Tenant actualizado." };
}

export async function updateCurrentTenantSettingsAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant } = await requireTenantAdminContext();
  const supabase = await createSupabaseServerClient();
  const result = parseTenantFormData(formData);

  if (!result.success) {
    return {
      status: "error",
      message: "Hay campos inválidos en la configuración del tenant.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("tenants")
    .update({
      name: result.data.name,
      slug: result.data.slug,
      status: result.data.status,
      primary_currency: result.data.primary_currency,
      timezone: result.data.timezone,
      locale: result.data.locale,
    })
    .eq("id", activeTenant.id);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return {
    status: "success",
    message: "Configuración del tenant actualizada.",
  };
}

function parseAddMembershipFormData(formData: FormData) {
  return tenantMembershipSchema.safeParse({
    email: formData.get("email")?.toString().trim().toLowerCase() ?? "",
    role: formData.get("role"),
    status: "active",
  });
}

async function getAuthCallbackUrl() {
  const headerStore = await headers();
  const proto = headerStore.get("x-forwarded-proto") ?? "http";
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");

  if (!host) {
    return undefined;
  }

  return `${proto}://${host}/auth/callback`;
}

export async function addTenantUserAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant } = await requireTenantAdminContext();
  const supabase = await createSupabaseServerClient();
  const result = parseAddMembershipFormData(formData);

  if (!result.success) {
    return {
      status: "error",
      message: "Hay campos inválidos en la membresía.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const userProfile = await getUserProfileByEmail(result.data.email);
  if (!userProfile) {
    const admin = createSupabaseAdminClient();
    const { data: invitedUser, error: inviteError } =
      await admin.auth.admin.inviteUserByEmail(result.data.email, {
        redirectTo: await getAuthCallbackUrl(),
        data: {
          tenant_id: activeTenant.id,
          tenant_role: result.data.role,
        },
      });

    if (inviteError || !invitedUser.user) {
      return {
        status: "error",
        message:
          inviteError?.message ?? "No se pudo enviar la invitación al usuario.",
      };
    }

    const { data: existingMembership, error: membershipLookupError } =
      await supabase
        .from("tenant_users")
        .select("id")
        .eq("tenant_id", activeTenant.id)
        .eq("user_id", invitedUser.user.id)
        .maybeSingle();

    if (membershipLookupError) {
      return {
        status: "error",
        message: membershipLookupError.message,
      };
    }

    if (existingMembership) {
      const { error } = await supabase
        .from("tenant_users")
        .update({
          role: result.data.role,
          status: "invited",
        })
        .eq("tenant_id", activeTenant.id)
        .eq("id", existingMembership.id);

      if (error) {
        return { status: "error", message: error.message };
      }
    } else {
      const { error } = await supabase.from("tenant_users").insert({
        tenant_id: activeTenant.id,
        user_id: invitedUser.user.id,
        role: result.data.role,
        status: "invited",
      });

      if (error) {
        return { status: "error", message: error.message };
      }
    }

    revalidatePath("/dashboard/settings");
    return {
      status: "success",
      message: "Invitación enviada. El usuario quedó como invitado.",
    };
  }

  const { data: existingMembership, error: existingMembershipError } =
    await supabase
      .from("tenant_users")
      .select("id, status")
      .eq("tenant_id", activeTenant.id)
      .eq("user_id", userProfile.id)
      .maybeSingle();

  if (existingMembershipError) {
    return { status: "error", message: existingMembershipError.message };
  }

  if (existingMembership) {
    const { error } = await supabase
      .from("tenant_users")
      .update({
        role: result.data.role,
        status: result.data.status,
      })
      .eq("tenant_id", activeTenant.id)
      .eq("id", existingMembership.id);

    if (error) {
      return { status: "error", message: error.message };
    }
  } else {
    const { error } = await supabase.from("tenant_users").insert({
      tenant_id: activeTenant.id,
      user_id: userProfile.id,
      role: result.data.role,
      status: result.data.status,
    });

    if (error) {
      return { status: "error", message: error.message };
    }
  }

  revalidatePath("/dashboard/settings");
  return { status: "success", message: "Miembro activo en el tenant." };
}

export async function updateTenantUserAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant } = await requireTenantAdminContext();
  const supabase = await createSupabaseServerClient();
  const memberId = formData.get("member_id")?.toString();

  if (!memberId) {
    return {
      status: "error",
      message: "Falta el identificador de membresía.",
    };
  }
  const result = tenantMembershipSchema.safeParse({
    email:
      formData.get("email")?.toString().trim().toLowerCase() ??
      "placeholder@example.com",
    role: formData.get("role"),
    status: formData.get("status"),
  });

  if (!result.success) {
    return {
      status: "error",
      message: "No se pudo actualizar la membresía.",
    };
  }

  const { data: membership, error: membershipError } = await supabase
    .from("tenant_users")
    .select("id, role, status, user_id")
    .eq("tenant_id", activeTenant.id)
    .eq("id", memberId)
    .single();

  if (membershipError || !membership) {
    return {
      status: "error",
      message: membershipError?.message ?? "La membresía no existe.",
    };
  }

  if (
    membership.role === "tenant_owner" &&
    (result.data.role !== "tenant_owner" || result.data.status !== "active")
  ) {
    const { count, error: ownerCountError } = await supabase
      .from("tenant_users")
      .select("*", { head: true, count: "exact" })
      .eq("tenant_id", activeTenant.id)
      .eq("role", "tenant_owner")
      .eq("status", "active");

    if (ownerCountError) {
      return { status: "error", message: ownerCountError.message };
    }

    if ((count ?? 0) <= 1) {
      return {
        status: "error",
        message: "No podés dejar al tenant sin owner activo.",
      };
    }
  }

  const { error } = await supabase
    .from("tenant_users")
    .update({
      role: result.data.role,
      status: result.data.status,
    })
    .eq("tenant_id", activeTenant.id)
    .eq("id", memberId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/dashboard/settings");
  return { status: "success", message: "Membresía actualizada." };
}
