"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  toBoolean,
  toNullableInteger,
  toNullableNumber,
  toNullableString,
} from "@/lib/utils";
import {
  requirePropertyDeleteContext,
  requirePropertyWriteContext,
} from "@/server/auth/tenant-context";
import type { ActionState } from "@/types/actions";
import { propertySchema } from "@/features/properties/schema";

function parsePropertyFormData(formData: FormData) {
  return propertySchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    external_ref: toNullableString(formData.get("external_ref")) ?? undefined,
    description: toNullableString(formData.get("description")) ?? undefined,
    operation_type: formData.get("operation_type"),
    property_type: formData.get("property_type"),
    price: toNullableNumber(formData.get("price")),
    currency: formData.get("currency")?.toString() ?? "PYG",
    expenses_amount: toNullableNumber(formData.get("expenses_amount")),
    location_text: toNullableString(formData.get("location_text")) ?? undefined,
    city: toNullableString(formData.get("city")) ?? undefined,
    neighborhood: toNullableString(formData.get("neighborhood")) ?? undefined,
    address: toNullableString(formData.get("address")) ?? undefined,
    bedrooms: toNullableInteger(formData.get("bedrooms")),
    bathrooms: toNullableInteger(formData.get("bathrooms")),
    garages: toNullableInteger(formData.get("garages")),
    area_m2: toNullableNumber(formData.get("area_m2")),
    lot_area_m2: toNullableNumber(formData.get("lot_area_m2")),
    status: formData.get("status"),
    pets_allowed: toBoolean(formData.get("pets_allowed")),
    furnished: toBoolean(formData.get("furnished")),
    has_pool: toBoolean(formData.get("has_pool")),
    has_garden: toBoolean(formData.get("has_garden")),
    has_balcony: toBoolean(formData.get("has_balcony")),
  });
}

export async function createPropertyAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant } = await requirePropertyWriteContext();
  const supabase = await createSupabaseServerClient();
  const result = parsePropertyFormData(formData);

  if (!result.success) {
    return {
      status: "error",
      message: "Hay campos inválidos en la propiedad.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("properties").insert({
    tenant_id: activeTenant.id,
    country: "Paraguay",
    source: "dashboard",
    ...result.data,
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidatePath("/dashboard/properties");
  redirect("/dashboard/properties");
}

export async function updatePropertyAction(
  propertyId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant } = await requirePropertyWriteContext();
  const supabase = await createSupabaseServerClient();
  const result = parsePropertyFormData(formData);

  if (!result.success) {
    return {
      status: "error",
      message: "Hay campos inválidos en la propiedad.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("properties")
    .update(result.data)
    .eq("tenant_id", activeTenant.id)
    .eq("id", propertyId);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidatePath("/dashboard/properties");
  revalidatePath(`/dashboard/properties/${propertyId}`);
  redirect(`/dashboard/properties/${propertyId}`);
}

export async function deletePropertyAction(propertyId: string) {
  const { activeTenant } = await requirePropertyDeleteContext();
  const supabase = await createSupabaseServerClient();

  await supabase
    .from("properties")
    .delete()
    .eq("tenant_id", activeTenant.id)
    .eq("id", propertyId);

  revalidatePath("/dashboard/properties");
  redirect("/dashboard/properties");
}
