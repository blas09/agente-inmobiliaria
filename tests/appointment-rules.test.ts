import {
  DEFAULT_APPOINTMENT_RULES,
  findAppointmentScheduleConflict,
  getAppointmentRules,
  validateAppointmentLocalDateTime,
} from "@/features/appointments/rules";

describe("appointment rules", () => {
  it("falls back to defaults when tenant settings are empty", () => {
    expect(getAppointmentRules(null)).toEqual(DEFAULT_APPOINTMENT_RULES);
  });

  it("rejects dates outside configured working days", () => {
    expect(
      validateAppointmentLocalDateTime(
        "2026-04-12T10:00",
        DEFAULT_APPOINTMENT_RULES,
      ),
    ).toBe(
      "La visita cae fuera de los días hábiles configurados para el tenant.",
    );
  });

  it("rejects dates outside configured business hours", () => {
    expect(
      validateAppointmentLocalDateTime(
        "2026-04-10T17:30",
        DEFAULT_APPOINTMENT_RULES,
      ),
    ).toBe(
      "La visita queda fuera del horario de atención configurado para el tenant.",
    );
  });

  it("accepts dates inside business rules", () => {
    expect(
      validateAppointmentLocalDateTime(
        "2026-04-10T10:00",
        DEFAULT_APPOINTMENT_RULES,
      ),
    ).toBeNull();
  });

  it("detects appointment conflicts including buffer time", () => {
    const candidates = [
      {
        id: "existing",
        scheduled_at: "2026-04-10T13:00:00.000Z",
      },
    ];

    expect(
      findAppointmentScheduleConflict(
        "2026-04-10T14:10:00.000Z",
        DEFAULT_APPOINTMENT_RULES,
        candidates,
      )?.id,
    ).toBe("existing");
  });

  it("allows appointments outside duration and buffer", () => {
    const candidates = [
      {
        id: "existing",
        scheduled_at: "2026-04-10T13:00:00.000Z",
      },
    ];

    expect(
      findAppointmentScheduleConflict(
        "2026-04-10T14:30:00.000Z",
        DEFAULT_APPOINTMENT_RULES,
        candidates,
      ),
    ).toBeNull();
  });

  it("ignores the current appointment when checking update conflicts", () => {
    const candidates = [
      {
        id: "current",
        scheduled_at: "2026-04-10T13:00:00.000Z",
      },
    ];

    expect(
      findAppointmentScheduleConflict(
        "2026-04-10T13:00:00.000Z",
        DEFAULT_APPOINTMENT_RULES,
        candidates,
        "current",
      ),
    ).toBeNull();
  });
});
