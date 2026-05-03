import type { AppointmentStatus } from "@/types/database";

export interface LeadReportingRecord {
  assigned_to: string | null;
  pipeline_stage_id: string | null;
}

export interface NamedReportingRecord {
  id: string;
  label: string;
}

export interface AppointmentReportingRecord {
  status: AppointmentStatus;
}

export interface MessageReportingRecord {
  conversation_id: string;
  direction: "inbound" | "outbound";
  created_at: string;
}

export function buildAdvisorReport(
  leads: LeadReportingRecord[],
  advisors: NamedReportingRecord[],
) {
  const advisorLabels = new Map(
    advisors.map((advisor) => [advisor.id, advisor.label]),
  );
  const totals = new Map<string, number>();

  for (const lead of leads) {
    const key = lead.assigned_to ?? "unassigned";
    totals.set(key, (totals.get(key) ?? 0) + 1);
  }

  return Array.from(totals.entries())
    .map(([advisorId, total]) => ({
      advisorId,
      label:
        advisorId === "unassigned"
          ? "Sin asignar"
          : (advisorLabels.get(advisorId) ?? "Asesor no disponible"),
      total,
    }))
    .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label));
}

export function buildPipelineReport(
  leads: LeadReportingRecord[],
  stages: NamedReportingRecord[],
) {
  const totals = new Map<string, number>();

  for (const lead of leads) {
    const key = lead.pipeline_stage_id ?? "without-stage";
    totals.set(key, (totals.get(key) ?? 0) + 1);
  }

  const stagedRows = stages.map((stage) => ({
    stageId: stage.id,
    label: stage.label,
    total: totals.get(stage.id) ?? 0,
  }));

  const withoutStage = totals.get("without-stage") ?? 0;
  return withoutStage > 0
    ? [
        ...stagedRows,
        {
          stageId: "without-stage",
          label: "Sin etapa",
          total: withoutStage,
        },
      ]
    : stagedRows;
}

export function buildAppointmentOutcomeReport(
  appointments: AppointmentReportingRecord[],
) {
  const statusOrder: AppointmentStatus[] = [
    "scheduled",
    "confirmed",
    "completed",
    "canceled",
    "no_show",
  ];
  const totals = new Map<AppointmentStatus, number>();

  for (const appointment of appointments) {
    totals.set(appointment.status, (totals.get(appointment.status) ?? 0) + 1);
  }

  return statusOrder.map((status) => ({
    status,
    total: totals.get(status) ?? 0,
  }));
}

export function buildFirstResponseReport(messages: MessageReportingRecord[]) {
  const messagesByConversation = new Map<string, MessageReportingRecord[]>();

  for (const message of messages) {
    const conversationMessages =
      messagesByConversation.get(message.conversation_id) ?? [];
    conversationMessages.push(message);
    messagesByConversation.set(message.conversation_id, conversationMessages);
  }

  let inboundConversations = 0;
  let respondedConversations = 0;
  let totalResponseMinutes = 0;

  for (const conversationMessages of messagesByConversation.values()) {
    const sortedMessages = [...conversationMessages].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
    const firstInbound = sortedMessages.find(
      (message) => message.direction === "inbound",
    );

    if (!firstInbound) {
      continue;
    }

    inboundConversations += 1;
    const firstOutboundAfterInbound = sortedMessages.find(
      (message) =>
        message.direction === "outbound" &&
        new Date(message.created_at).getTime() >
          new Date(firstInbound.created_at).getTime(),
    );

    if (!firstOutboundAfterInbound) {
      continue;
    }

    respondedConversations += 1;
    totalResponseMinutes += Math.round(
      (new Date(firstOutboundAfterInbound.created_at).getTime() -
        new Date(firstInbound.created_at).getTime()) /
        60000,
    );
  }

  return {
    inboundConversations,
    respondedConversations,
    pendingResponseConversations: inboundConversations - respondedConversations,
    averageFirstResponseMinutes:
      respondedConversations > 0
        ? Math.round(totalResponseMinutes / respondedConversations)
        : null,
  };
}
