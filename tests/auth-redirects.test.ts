import { getSafeAppRedirectUrl } from "@/server/auth/redirects";

describe("auth redirects", () => {
  it("allows same-origin relative paths", () => {
    expect(
      getSafeAppRedirectUrl("/dashboard/leads", "https://app.example.com").href,
    ).toBe("https://app.example.com/dashboard/leads");
  });

  it("falls back when next is missing or external", () => {
    expect(getSafeAppRedirectUrl(null, "https://app.example.com").href).toBe(
      "https://app.example.com/dashboard",
    );
    expect(
      getSafeAppRedirectUrl(
        "https://evil.example.com/phish",
        "https://app.example.com",
      ).href,
    ).toBe("https://app.example.com/dashboard");
    expect(
      getSafeAppRedirectUrl(
        "//evil.example.com/phish",
        "https://app.example.com",
      ).href,
    ).toBe("https://app.example.com/dashboard");
  });
});
