import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export async function createSupabaseServerClient() {
	const cookieStore = await cookies();
	const env = getEnv();

	return createServerClient<Database>(
		env.NEXT_PUBLIC_SUPABASE_URL,
		env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						for (const cookie of cookiesToSet) {
							cookieStore.set(cookie.name, cookie.value, cookie.options);
						}
					} catch {
						// Cookie writes are ignored during server component renders.
					}
				},
			},
		},
	);
}
