import { cn, formatCompactNumber, formatDateTimeLocalInput, zonedDateTimeLocalToUtcIso } from "@/lib/utils";

describe("utils", () => {
	it("merges class names", () => {
		expect(cn("p-4", "text-sm")).toContain("p-4");
	});

	it("formats compact numbers", () => {
		expect(formatCompactNumber(1200)).toBe("1.2K");
	});

	it("converts tenant local datetime to utc iso", () => {
		expect(zonedDateTimeLocalToUtcIso("2026-04-08T15:30", "America/Argentina/Buenos_Aires")).toBe(
			"2026-04-08T18:30:00.000Z",
		);
	});

	it("formats utc datetime into a datetime-local input string", () => {
		expect(
			formatDateTimeLocalInput("2026-04-08T18:30:00.000Z", "America/Argentina/Buenos_Aires"),
		).toBe("2026-04-08T15:30");
	});
});
