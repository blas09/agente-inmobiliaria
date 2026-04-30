import type { AppointmentStatus, Json } from "@/types/database";

export interface AppointmentAuditSnapshot {
  property_id: string | null;
  advisor_id: string | null;
  scheduled_at: string;
  status: AppointmentStatus;
  notes: string | null;
}

export function getAppointmentChangeSet(
  before: AppointmentAuditSnapshot,
  after: AppointmentAuditSnapshot,
) {
  const changes: Record<string, { before: Json; after: Json }> = {};
  const fields = [
    "property_id",
    "advisor_id",
    "scheduled_at",
    "status",
    "notes",
  ] as const;

  for (const field of fields) {
    if (before[field] !== after[field]) {
      changes[field] = {
        before: before[field],
        after: after[field],
      };
    }
  }

  return changes;
}
