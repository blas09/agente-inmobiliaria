"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toNullableString } from "@/lib/utils";
import { requireFaqManageContext } from "@/server/auth/tenant-context";
import type { ActionState } from "@/types/actions";
import { faqSchema } from "@/features/faqs/schema";

function parseFaqFormData(formData: FormData) {
  return faqSchema.safeParse({
    question: formData.get("question")?.toString() ?? "",
    answer: formData.get("answer")?.toString() ?? "",
    category: toNullableString(formData.get("category")) ?? undefined,
    status: formData.get("status"),
  });
}

export async function createFaqAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant } = await requireFaqManageContext();
  const supabase = await createSupabaseServerClient();
  const result = parseFaqFormData(formData);

  if (!result.success) {
    return {
      status: "error",
      message: "Hay campos inválidos en la FAQ.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("faqs").insert({
    tenant_id: activeTenant.id,
    ...result.data,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/dashboard/faqs");
  redirect("/dashboard/faqs");
}

export async function updateFaqAction(
  faqId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant } = await requireFaqManageContext();
  const supabase = await createSupabaseServerClient();
  const result = parseFaqFormData(formData);

  if (!result.success) {
    return {
      status: "error",
      message: "Hay campos inválidos en la FAQ.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("faqs")
    .update(result.data)
    .eq("tenant_id", activeTenant.id)
    .eq("id", faqId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/dashboard/faqs");
  redirect("/dashboard/faqs");
}

export async function deleteFaqAction(faqId: string) {
  const { activeTenant } = await requireFaqManageContext();
  const supabase = await createSupabaseServerClient();

  await supabase
    .from("faqs")
    .delete()
    .eq("tenant_id", activeTenant.id)
    .eq("id", faqId);

  revalidatePath("/dashboard/faqs");
  redirect("/dashboard/faqs");
}
