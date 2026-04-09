import { getEnv } from "@/lib/env";

interface ResolvedWhatsAppCredentials {
  accessToken: string;
  phoneNumberId: string;
  apiVersion: string;
}

type CredentialsMap = Record<
  string,
  {
    accessToken: string;
    phoneNumberId?: string;
  }
>;

function parseCredentialsMap() {
  const env = getEnv();
  if (!env.WHATSAPP_CREDENTIALS_JSON) {
    return {} satisfies CredentialsMap;
  }

  try {
    return JSON.parse(env.WHATSAPP_CREDENTIALS_JSON) as CredentialsMap;
  } catch {
    throw new Error("WHATSAPP_CREDENTIALS_JSON is not valid JSON.");
  }
}

export function resolveWhatsAppCredentials(input: {
  credentialsRef?: string | null;
  phoneNumberId?: string | null;
}): ResolvedWhatsAppCredentials {
  const env = getEnv();
  const credentialsMap = parseCredentialsMap();
  const apiVersion = env.WHATSAPP_CLOUD_API_VERSION ?? "v22.0";

  const byRef =
    (input.credentialsRef && credentialsMap[input.credentialsRef]) || undefined;
  const byPhoneId =
    (input.phoneNumberId && credentialsMap[input.phoneNumberId]) || undefined;
  const resolved = byRef ?? byPhoneId;

  if (!resolved?.accessToken) {
    throw new Error(
      "WhatsApp credentials are not configured for this channel. Resolve them through WHATSAPP_CREDENTIALS_JSON.",
    );
  }

  const phoneNumberId = resolved.phoneNumberId ?? input.phoneNumberId;
  if (!phoneNumberId) {
    throw new Error(
      "WhatsApp phone_number_id is required to send outbound messages.",
    );
  }

  return {
    accessToken: resolved.accessToken,
    phoneNumberId,
    apiVersion,
  };
}
