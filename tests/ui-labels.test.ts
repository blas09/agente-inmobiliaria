import {
  getChannelStatusLabel,
  getConversationStatusLabel,
  getLeadQualificationStatusLabel,
  getMessageStatusLabel,
  getPropertyStatusLabel,
  getTenantRoleLabel,
} from "@/lib/ui-labels";

describe("UI labels", () => {
  it("returns Spanish labels for customer-facing statuses", () => {
    expect(getPropertyStatusLabel("available")).toBe("Disponible");
    expect(getLeadQualificationStatusLabel("qualified")).toBe("Calificado");
    expect(getConversationStatusLabel("pending_human")).toBe(
      "Pendiente humano",
    );
    expect(getChannelStatusLabel("connected")).toBe("Conectado");
    expect(getMessageStatusLabel("delivered")).toBe("Entregado");
    expect(getTenantRoleLabel("advisor")).toBe("Asesor");
  });

  it("keeps unknown values visible as a fallback", () => {
    expect(getChannelStatusLabel("custom_status")).toBe("custom_status");
  });
});
