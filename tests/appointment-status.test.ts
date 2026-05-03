import {
  getAppointmentStatusLabel,
  getAppointmentStatusTone,
} from "@/features/appointments/status";

describe("appointment status helpers", () => {
  it("returns Spanish labels for appointment statuses", () => {
    expect(getAppointmentStatusLabel("scheduled")).toBe("Agendada");
    expect(getAppointmentStatusLabel("confirmed")).toBe("Confirmada");
    expect(getAppointmentStatusLabel("completed")).toBe("Completada");
    expect(getAppointmentStatusLabel("canceled")).toBe("Cancelada");
    expect(getAppointmentStatusLabel("no_show")).toBe("No asistió");
  });

  it("returns distinct UI tones for operational appointment states", () => {
    expect(getAppointmentStatusTone("scheduled")).toBe("warning");
    expect(getAppointmentStatusTone("confirmed")).toBe("success");
    expect(getAppointmentStatusTone("completed")).toBe("info");
    expect(getAppointmentStatusTone("canceled")).toBe("destructive");
    expect(getAppointmentStatusTone("no_show")).toBe("outlineWarning");
  });
});
