import {
  DEFAULT_APPOINTMENT_RULES,
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
});
