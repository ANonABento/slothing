import { describe, expect, it } from "vitest";
import { detectStatusFromEmail, shouldAdvanceStatus } from "./status-patterns";

describe("detectStatusFromEmail", () => {
  it.each([
    ["Thank you for applying to Acme", "applied"],
    ["Can we schedule a call for the next round?", "interviewing"],
    [
      "Unfortunately, we decided to move forward with another candidate",
      "rejected",
    ],
    ["We would like to extend an offer. Offer letter attached.", "offer"],
  ] as const)("detects %s as %s", (body, status) => {
    const result = detectStatusFromEmail({ body });
    expect(result?.status).toBe(status);
    expect(result?.reason).toBeTruthy();
    expect(result?.evidence.length).toBeGreaterThan(0);
  });

  it("ignores a false positive offer email", () => {
    expect(
      detectStatusFromEmail({
        subject: "Benefits",
        body: "We offer great benefits to every employee.",
      }),
    ).toBeNull();
  });

  it("ignores benefits and perks offer language", () => {
    expect(
      detectStatusFromEmail({
        subject: "Our employee offer",
        body: "Our offer includes health benefits, wellness perks, and PTO.",
      }),
    ).toBeNull();
  });

  it("ignores unfortunate reschedule language", () => {
    expect(
      detectStatusFromEmail({
        body: "Unfortunately, we need to reschedule tomorrow's recruiter call.",
      }),
    ).toBeNull();
  });

  it("still detects real unfortunately rejection language", () => {
    expect(
      detectStatusFromEmail({
        body: "Unfortunately, we decided to move forward with another candidate.",
      })?.status,
    ).toBe("rejected");
  });
});

describe("shouldAdvanceStatus", () => {
  it("allows forward-only status changes", () => {
    expect(shouldAdvanceStatus("saved", "applied")).toBe(true);
    expect(shouldAdvanceStatus("applied", "interviewing")).toBe(true);
    expect(shouldAdvanceStatus("interviewing", "offer")).toBe(true);
    expect(shouldAdvanceStatus("interviewing", "rejected")).toBe(true);
  });

  it("blocks downgrades and terminal overwrites", () => {
    expect(shouldAdvanceStatus("interviewing", "applied")).toBe(false);
    expect(shouldAdvanceStatus("offer", "interviewing")).toBe(false);
    expect(shouldAdvanceStatus("rejected", "interviewing")).toBe(false);
  });
});
