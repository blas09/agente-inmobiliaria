import { readFileSync } from "node:fs";
import { z } from "zod";

const seedUuidPattern =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;

const localSupabaseAuthInstanceId = "00000000-0000-0000-0000-000000000000";
const uuidSchema = z.string().uuid();

describe("seed UUIDs", () => {
  it("uses app-valid UUIDs except the local Supabase Auth nil instance id", () => {
    const seedSql = readFileSync("supabase/seed.sql", "utf8");
    const uuids = Array.from(
      seedSql.matchAll(seedUuidPattern),
      (match) => match[0],
    );

    const invalidUuids = Array.from(new Set(uuids)).filter(
      (uuid) =>
        uuid !== localSupabaseAuthInstanceId &&
        !uuidSchema.safeParse(uuid).success,
    );

    expect(invalidUuids).toEqual([]);
  });
});
