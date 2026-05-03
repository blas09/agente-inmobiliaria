import {
  buildAdvisorReport,
  buildAppointmentOutcomeReport,
  buildFirstResponseReport,
  buildPipelineReport,
} from "@/server/queries/dashboard-reporting";

describe("dashboard reporting helpers", () => {
  it("groups leads by advisor and keeps unassigned leads visible", () => {
    expect(
      buildAdvisorReport(
        [
          { assigned_to: "advisor-1", pipeline_stage_id: null },
          { assigned_to: "advisor-1", pipeline_stage_id: "stage-1" },
          { assigned_to: null, pipeline_stage_id: "stage-1" },
        ],
        [{ id: "advisor-1", label: "Ana" }],
      ),
    ).toEqual([
      { advisorId: "advisor-1", label: "Ana", total: 2 },
      { advisorId: "unassigned", label: "Sin asignar", total: 1 },
    ]);
  });

  it("keeps configured pipeline stages in order and includes leads without stage", () => {
    expect(
      buildPipelineReport(
        [
          { assigned_to: null, pipeline_stage_id: "stage-2" },
          { assigned_to: null, pipeline_stage_id: null },
        ],
        [
          { id: "stage-1", label: "Nuevo" },
          { id: "stage-2", label: "Visita" },
        ],
      ),
    ).toEqual([
      { stageId: "stage-1", label: "Nuevo", total: 0 },
      { stageId: "stage-2", label: "Visita", total: 1 },
      { stageId: "without-stage", label: "Sin etapa", total: 1 },
    ]);
  });

  it("returns appointment outcomes for every operational status", () => {
    expect(
      buildAppointmentOutcomeReport([
        { status: "confirmed" },
        { status: "confirmed" },
        { status: "canceled" },
      ]),
    ).toEqual([
      { status: "scheduled", total: 0 },
      { status: "confirmed", total: 2 },
      { status: "completed", total: 0 },
      { status: "canceled", total: 1 },
      { status: "no_show", total: 0 },
    ]);
  });

  it("calculates first response timing from inbound and outbound messages", () => {
    expect(
      buildFirstResponseReport([
        {
          conversation_id: "conversation-1",
          direction: "inbound",
          created_at: "2026-05-03T10:00:00.000Z",
        },
        {
          conversation_id: "conversation-1",
          direction: "outbound",
          created_at: "2026-05-03T10:10:00.000Z",
        },
        {
          conversation_id: "conversation-2",
          direction: "inbound",
          created_at: "2026-05-03T10:00:00.000Z",
        },
      ]),
    ).toEqual({
      inboundConversations: 2,
      respondedConversations: 1,
      pendingResponseConversations: 1,
      averageFirstResponseMinutes: 10,
    });
  });
});
