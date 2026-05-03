import type {
  ChannelType,
  ConversationStatus,
  LeadQualificationStatus,
  MembershipStatus,
  OperationType,
  PropertyStatus,
  PropertyType,
  TenantRole,
  TenantStatus,
} from "@/types/database";

type LabelMap<T extends string> = Record<T, string>;

function getLabel<T extends string>(
  labels: Partial<LabelMap<T>>,
  value: T | string | null | undefined,
  fallback = "Sin definir",
) {
  if (!value) {
    return fallback;
  }

  return labels[value as T] ?? value;
}

export const operationTypeLabels: LabelMap<OperationType> = {
  sale: "Venta",
  rent: "Alquiler",
};

export const leadInterestTypeLabels: LabelMap<OperationType> = {
  sale: "Compra",
  rent: "Alquiler",
};

export const propertyStatusLabels: LabelMap<PropertyStatus> = {
  draft: "Borrador",
  available: "Disponible",
  reserved: "Reservada",
  rented: "Alquilada",
  sold: "Vendida",
  inactive: "Inactiva",
};

export const propertyTypeLabels: LabelMap<PropertyType> = {
  apartment: "Departamento",
  house: "Casa",
  land: "Terreno",
  office: "Oficina",
  commercial: "Local comercial",
  warehouse: "Depósito",
  duplex: "Dúplex",
  condo: "Condominio",
  other: "Otro",
};

export const leadQualificationStatusLabels: LabelMap<LeadQualificationStatus> =
  {
    new: "Nuevo",
    contacted: "Contactado",
    qualified: "Calificado",
    unqualified: "No calificado",
    nurturing: "Seguimiento",
    won: "Ganado",
    lost: "Perdido",
  };

export const leadSourceLabels = {
  whatsapp: "WhatsApp",
  manual: "Manual",
  email: "Email",
  webchat: "Webchat",
  instagram: "Instagram",
  facebook_leads: "Facebook Leads",
} as const;

export const conversationStatusLabels: LabelMap<ConversationStatus> = {
  open: "Abierta",
  pending_human: "Pendiente humano",
  automated: "Automatizada",
  closed: "Cerrada",
};

export const channelTypeLabels: LabelMap<ChannelType> = {
  whatsapp: "WhatsApp",
  email: "Email",
  webchat: "Webchat",
  instagram: "Instagram",
  facebook_leads: "Facebook Leads",
};

export const tenantStatusLabels: LabelMap<TenantStatus> = {
  trial: "Prueba",
  active: "Activo",
  suspended: "Suspendido",
  archived: "Archivado",
};

export const membershipStatusLabels: LabelMap<MembershipStatus> = {
  invited: "Invitado",
  active: "Activo",
  suspended: "Suspendido",
  removed: "Removido",
};

export const tenantRoleLabels: LabelMap<TenantRole> = {
  tenant_owner: "Propietario",
  tenant_admin: "Administrador",
  advisor: "Asesor",
  operator: "Operador",
  viewer: "Lectura",
};

export const faqStatusLabels = {
  active: "Activa",
  inactive: "Inactiva",
} as const;

export const pipelineCategoryLabels = {
  inbox: "Bandeja",
  qualified: "Calificado",
  visit: "Visita",
  negotiation: "Negociación",
  won: "Ganado",
  lost: "Perdido",
} as const;

export const channelStatusLabels = {
  connected: "Conectado",
  pending: "Pendiente",
  disconnected: "Desconectado",
  error: "Con error",
} as const;

export const whatsappWebhookStatusLabels = {
  active: "Activo",
  pending: "Pendiente",
  disconnected: "Desconectado",
  error: "Con error",
} as const;

export const whatsappTemplateStatusLabels = {
  approved: "Aprobado",
  pending: "Pendiente",
  rejected: "Rechazado",
  paused: "Pausado",
} as const;

export const whatsappTemplateCategoryLabels = {
  UTILITY: "Utilidad",
  MARKETING: "Marketing",
  AUTHENTICATION: "Autenticación",
} as const;

export const messageDirectionLabels = {
  inbound: "Entrante",
  outbound: "Saliente",
} as const;

export const messageSenderTypeLabels = {
  lead: "Lead",
  agent: "Asesor",
  system: "Sistema",
  ai: "IA",
} as const;

export const messageStatusLabels = {
  received: "Recibido",
  queued: "En cola",
  sent: "Enviado",
  delivered: "Entregado",
  read: "Leído",
  failed: "Fallido",
} as const;

export const channelProviderLabels = {
  meta_whatsapp_cloud: "Meta WhatsApp Cloud",
} as const;

export const channelEventTypeLabels = {
  "whatsapp.message.outbound": "Mensaje saliente",
  "whatsapp.message.outbound.failed": "Mensaje saliente fallido",
  "whatsapp.message.outbound.retry": "Reintento saliente",
  "whatsapp.message.outbound.retry.failed": "Reintento saliente fallido",
  "whatsapp.message.inbound": "Mensaje entrante",
  "whatsapp.status.sent": "Estado enviado",
  "whatsapp.status.delivered": "Estado entregado",
  "whatsapp.status.read": "Estado leído",
  "whatsapp.status.failed": "Estado fallido",
  "whatsapp.webhook.rejected": "Webhook rechazado",
} as const;

export function getOperationTypeLabel(value: OperationType | string | null) {
  return getLabel(operationTypeLabels, value);
}

export function getLeadInterestTypeLabel(value: OperationType | string | null) {
  return getLabel(leadInterestTypeLabels, value);
}

export function getPropertyStatusLabel(value: PropertyStatus | string | null) {
  return getLabel(propertyStatusLabels, value);
}

export function getPropertyTypeLabel(value: PropertyType | string | null) {
  return getLabel(propertyTypeLabels, value);
}

export function getLeadQualificationStatusLabel(
  value: LeadQualificationStatus | string | null,
) {
  return getLabel(leadQualificationStatusLabels, value);
}

export function getLeadSourceLabel(value: string | null) {
  return getLabel(leadSourceLabels, value, "Sin fuente");
}

export function getConversationStatusLabel(
  value: ConversationStatus | string | null,
) {
  return getLabel(conversationStatusLabels, value);
}

export function getChannelTypeLabel(value: ChannelType | string | null) {
  return getLabel(channelTypeLabels, value);
}

export function getTenantStatusLabel(value: TenantStatus | string | null) {
  return getLabel(tenantStatusLabels, value);
}

export function getMembershipStatusLabel(
  value: MembershipStatus | string | null,
) {
  return getLabel(membershipStatusLabels, value);
}

export function getTenantRoleLabel(value: TenantRole | string | null) {
  return getLabel(tenantRoleLabels, value);
}

export function getFaqStatusLabel(value: string | null) {
  return getLabel(faqStatusLabels, value);
}

export function getPipelineCategoryLabel(value: string | null) {
  return getLabel(pipelineCategoryLabels, value);
}

export function getChannelStatusLabel(value: string | null) {
  return getLabel(channelStatusLabels, value);
}

export function getWhatsAppWebhookStatusLabel(value: string | null) {
  return getLabel(whatsappWebhookStatusLabels, value);
}

export function getWhatsAppTemplateStatusLabel(value: string | null) {
  return getLabel(whatsappTemplateStatusLabels, value, "Sin estado");
}

export function getWhatsAppTemplateCategoryLabel(value: string | null) {
  return getLabel(whatsappTemplateCategoryLabels, value, "Sin categoría");
}

export function getMessageDirectionLabel(value: string | null) {
  return getLabel(messageDirectionLabels, value);
}

export function getMessageSenderTypeLabel(value: string | null) {
  return getLabel(messageSenderTypeLabels, value);
}

export function getMessageStatusLabel(value: string | null) {
  return getLabel(messageStatusLabels, value);
}

export function getChannelProviderLabel(value: string | null) {
  return getLabel(channelProviderLabels, value);
}

export function getChannelEventTypeLabel(value: string | null) {
  return getLabel(channelEventTypeLabels, value);
}
