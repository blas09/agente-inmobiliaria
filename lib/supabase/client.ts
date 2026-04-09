"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getEnv } from "@/lib/env";
import type { Database } from "@/types/database";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createSupabaseBrowserClient() {
	if (client) return client;

	const env = getEnv();
	client = createBrowserClient<Database>(
		env.NEXT_PUBLIC_SUPABASE_URL,
		env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	);

	return client;
}

