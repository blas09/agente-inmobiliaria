import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { activateAcceptedTenantInvitations } from "@/server/auth/invitations";
import { getSafeAppRedirectUrl } from "@/server/auth/redirects";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await activateAcceptedTenantInvitations(data.user.id);
    }
  }

  const redirectUrl = getSafeAppRedirectUrl(next, requestUrl.origin);
  return NextResponse.redirect(redirectUrl);
}
