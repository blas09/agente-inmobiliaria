import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { hasSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
	if (!hasSupabaseEnv()) {
		return NextResponse.next({ request });
	}

	let response = NextResponse.next({ request });

	const supabase = createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					response = NextResponse.next({ request });

					for (const cookie of cookiesToSet) {
						response.cookies.set(cookie.name, cookie.value, cookie.options);
					}
				},
			},
		},
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
	const isLoginRoute = request.nextUrl.pathname.startsWith("/login");

	if (!user && isDashboardRoute) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/login";
		return NextResponse.redirect(redirectUrl);
	}

	if (user && isLoginRoute) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/dashboard";
		return NextResponse.redirect(redirectUrl);
	}

	return response;
}

