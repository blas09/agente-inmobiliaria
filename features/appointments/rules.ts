import type { Json } from "@/types/database";
import { z } from "zod";

const workingDaySchema = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, "Usá formato HH:MM.");

export const appointmentRulesSchema = z.object({
  default_duration_minutes: z.coerce.number().int().min(15).max(480),
  buffer_minutes: z.coerce.number().int().min(0).max(180),
  advance_notice_hours: z.coerce.number().int().min(0).max(336),
  business_hours_start: timeSchema,
  business_hours_end: timeSchema,
  working_days: z
    .array(workingDaySchema)
    .min(1, "Seleccioná al menos un día hábil."),
});

export type AppointmentRules = z.infer<typeof appointmentRulesSchema>;
export type WorkingDay = z.infer<typeof workingDaySchema>;

export const DEFAULT_APPOINTMENT_RULES: AppointmentRules = {
  default_duration_minutes: 60,
  buffer_minutes: 15,
  advance_notice_hours: 2,
  business_hours_start: "08:00",
  business_hours_end: "18:00",
  working_days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
};

const dayLabels: Record<WorkingDay, string> = {
  monday: "Lun",
  tuesday: "Mar",
  wednesday: "Mié",
  thursday: "Jue",
  friday: "Vie",
  saturday: "Sáb",
  sunday: "Dom",
};

function isPlainObject(
  value: Json | null | undefined,
): value is Record<string, Json | undefined> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getAppointmentRules(
  settings: Json | null | undefined,
): AppointmentRules {
  if (!isPlainObject(settings)) {
    return DEFAULT_APPOINTMENT_RULES;
  }

  const appointmentSettings = settings.appointments;
  if (!isPlainObject(appointmentSettings)) {
    return DEFAULT_APPOINTMENT_RULES;
  }

  const parsed = appointmentRulesSchema.safeParse(appointmentSettings);
  return parsed.success ? parsed.data : DEFAULT_APPOINTMENT_RULES;
}

export function mergeAppointmentRulesIntoSettings(
  settings: Json | null | undefined,
  rules: AppointmentRules,
): Json {
  const baseSettings = isPlainObject(settings) ? settings : {};
  return {
    ...baseSettings,
    appointments: rules,
  };
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function summarizeAppointmentRules(rules: AppointmentRules) {
  return `${rules.working_days.map((day) => dayLabels[day]).join(", ")} · ${rules.business_hours_start}-${
    rules.business_hours_end
  } · ${rules.default_duration_minutes} min por visita · buffer ${rules.buffer_minutes} min`;
}

export function validateAppointmentLocalDateTime(
  localValue: string,
  rules: AppointmentRules,
) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(localValue);
  if (!match) {
    return "La fecha y hora no tienen un formato válido.";
  }

  const [, year, month, day, hour, minute] = match;
  const localDate = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  );
  const weekdayMap: WorkingDay[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const weekday = weekdayMap[localDate.getUTCDay()];

  if (!rules.working_days.includes(weekday)) {
    return "La visita cae fuera de los días hábiles configurados para el tenant.";
  }

  const scheduledMinutes = Number(hour) * 60 + Number(minute);
  const businessStart = timeToMinutes(rules.business_hours_start);
  const businessEnd = timeToMinutes(rules.business_hours_end);
  const appointmentEnd = scheduledMinutes + rules.default_duration_minutes;

  if (scheduledMinutes < businessStart || appointmentEnd > businessEnd) {
    return "La visita queda fuera del horario de atención configurado para el tenant.";
  }

  return null;
}
