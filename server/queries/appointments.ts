import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppointmentStatus, Tables } from "@/types/database";

export interface AppointmentWithRelations extends Tables<"appointments"> {
  lead: Pick<Tables<"leads">, "id" | "full_name" | "phone" | "email"> | null;
  property: Pick<Tables<"properties">, "id" | "title" | "external_ref"> | null;
  advisor: Pick<Tables<"user_profiles">, "id" | "full_name" | "email"> | null;
}

const appointmentStatuses = new Set<AppointmentStatus>([
  "scheduled",
  "confirmed",
  "completed",
  "canceled",
  "no_show",
]);

async function enrichAppointments(appointments: Tables<"appointments">[]) {
  if (appointments.length === 0) {
    return [] as AppointmentWithRelations[];
  }

  const supabase = await createSupabaseServerClient();
  const leadIds = Array.from(
    new Set(appointments.map((appointment) => appointment.lead_id)),
  );
  const propertyIds = Array.from(
    new Set(
      appointments
        .map((appointment) => appointment.property_id)
        .filter((propertyId): propertyId is string => Boolean(propertyId)),
    ),
  );
  const advisorIds = Array.from(
    new Set(
      appointments
        .map((appointment) => appointment.advisor_id)
        .filter((advisorId): advisorId is string => Boolean(advisorId)),
    ),
  );

  const [leadsResponse, propertiesResponse, advisorsResponse] =
    await Promise.all([
      supabase
        .from("leads")
        .select("id, full_name, phone, email")
        .in("id", leadIds),
      propertyIds.length > 0
        ? supabase
            .from("properties")
            .select("id, title, external_ref")
            .in("id", propertyIds)
        : Promise.resolve({ data: [], error: null }),
      advisorIds.length > 0
        ? supabase
            .from("user_profiles")
            .select("id, full_name, email")
            .in("id", advisorIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

  if (leadsResponse.error) {
    throw new Error(
      `Failed to load appointment leads: ${leadsResponse.error.message}`,
    );
  }

  if (propertiesResponse.error) {
    throw new Error(
      `Failed to load appointment properties: ${propertiesResponse.error.message}`,
    );
  }

  if (advisorsResponse.error) {
    throw new Error(
      `Failed to load appointment advisors: ${advisorsResponse.error.message}`,
    );
  }

  const leadMap = new Map(
    (leadsResponse.data ?? []).map((lead) => [lead.id, lead]),
  );
  const propertyMap = new Map(
    (propertiesResponse.data ?? []).map((property) => [property.id, property]),
  );
  const advisorMap = new Map(
    (advisorsResponse.data ?? []).map((advisor) => [advisor.id, advisor]),
  );

  return appointments.map((appointment) => ({
    ...appointment,
    lead: leadMap.get(appointment.lead_id) ?? null,
    property: appointment.property_id
      ? (propertyMap.get(appointment.property_id) ?? null)
      : null,
    advisor: appointment.advisor_id
      ? (advisorMap.get(appointment.advisor_id) ?? null)
      : null,
  }));
}

export async function listAppointments(
  tenantId: string,
  filters?: { status?: string; advisorId?: string },
) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("appointments")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("scheduled_at", { ascending: true });

  if (
    filters?.status &&
    filters.status !== "all" &&
    appointmentStatuses.has(filters.status as AppointmentStatus)
  ) {
    query = query.eq("status", filters.status as AppointmentStatus);
  }

  if (filters?.advisorId && filters.advisorId !== "all") {
    query = query.eq("advisor_id", filters.advisorId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load appointments: ${error.message}`);
  }

  return enrichAppointments(data ?? []);
}

export async function getLeadAppointments(tenantId: string, leadId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("lead_id", leadId)
    .order("scheduled_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load lead appointments: ${error.message}`);
  }

  return enrichAppointments(data ?? []);
}
