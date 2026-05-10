import { describe, expect, it } from "vitest";
import { detectStatusFromEmail, shouldAdvanceStatus } from "./status-patterns";

describe("detectStatusFromEmail", () => {
  it.each([
    ["Thank you for applying to Acme", "applied"],
    ["Can we schedule a call for the next round?", "interviewing"],
    ["Unfortunately, we decided to move forward with another candidate", "rejected"],
    ["We would like to extend an offer. Offer letter attached.", "offer"],
  ] as const)("detects %s as %s", (body, status) => {
    expect(detectStatusFromEmail({ body })?.status).toBe(status);
  });

  it("ignores a false positive offer email", () => {
    expect(
      detectStatusFromEmail({
        subject: "Benefits",
        body: "We offer great benefits to every employee.",
      }),
    ).toBeNull();
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
