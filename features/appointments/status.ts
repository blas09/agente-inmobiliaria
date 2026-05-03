import type { AppointmentStatus } from "@/types/database";

export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  scheduled: "Agendada",
  confirmed: "Confirmada",
  completed: "Completada",
  canceled: "Cancelada",
  no_show: "No asistió",
};

export function getAppointmentStatusLabel(status: AppointmentStatus) {
  return appointmentStatusLabels[status] ?? status;
}

export function getAppointmentStatusTone(status: AppointmentStatus) {
  switch (status) {
    case "confirmed":
      return "success";
    case "scheduled":
      return "warning";
    case "completed":
      return "info";
    case "canceled":
      return "destructive";
    case "no_show":
      return "outlineWarning";
    default:
      return "outline";
  }
}
