import { NextResponse } from "next/server";

import { getEnv } from "@/lib/env";
import { processWhatsAppWebhook } from "@/server/services/whatsapp-inbound";

export async function GET(request: Request) {
	const env = getEnv();
	const url = new URL(request.url);
	const mode = url.searchParams.get("hub.mode");
	const token = url.searchParams.get("hub.verify_token");
	const challenge = url.searchParams.get("hub.challenge");

	if (
		mode === "subscribe" &&
		env.WHATSAPP_WEBHOOK_VERIFY_TOKEN &&
		token === env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
	) {
		return new NextResponse(challenge, { status: 200 });
	}

	return NextResponse.json({ error: "Invalid webhook verification request" }, { status: 403 });
}

export async function POST(request: Request) {
	const payload = await request.json();
	const result = await processWhatsAppWebhook(payload);

	return NextResponse.json({ ok: true, ...result });
}
