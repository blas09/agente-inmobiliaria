import { getAppointmentChangeSet } from "@/features/appointments/audit";

describe("appointment audit", () => {
  it("returns only changed appointment fields", () => {
    expect(
      getAppointmentChangeSet(
        {
          property_id: "property-1",
          advisor_id: "advisor-1",
          scheduled_at: "2026-04-10T13:00:00.000Z",
          status: "scheduled",
          notes: "Original",
        },
        {
          property_id: "property-1",
          advisor_id: "advisor-2",
          scheduled_at: "2026-04-10T14:00:00.000Z",
          status: "confirmed",
          notes: "Original",
        },
      ),
    ).toEqual({
      advisor_id: {
        before: "advisor-1",
        after: "advisor-2",
      },
      scheduled_at: {
        before: "2026-04-10T13:00:00.000Z",
        after: "2026-04-10T14:00:00.000Z",
      },
      status: {
        before: "scheduled",
        after: "confirmed",
      },
    });
  });

  it("returns no changes when appointment fields are unchanged", () => {
    const snapshot = {
      property_id: null,
      advisor_id: "advisor-1",
      scheduled_at: "2026-04-10T13:00:00.000Z",
      status: "scheduled" as const,
      notes: null,
    };

    expect(getAppointmentChangeSet(snapshot, snapshot)).toEqual({});
  });
});
