import { describe, expect, it } from "vitest";
import { generateEmail } from "./templates";

describe("email templates", () => {
  it("generates cold outreach copy with the target company", () => {
    const email = generateEmail("cold_outreach", {
      targetCompany: "Acme Labs",
      connectionName: "Sam",
      hookNote: "I liked the launch of your developer platform.",
    });

    expect(email.subject).toContain("Acme Labs");
    expect(email.body).toContain("Acme Labs");
    expect(email.body).toContain("Sam");
  });

  it("generates an interested recruiter reply", () => {
    const email = generateEmail("recruiter_reply", {
      recruiterName: "Morgan",
      recruiterCompany: "Northstar",
      recruiterStance: "interested",
    });

    expect(email.subject).toContain("Northstar");
    expect(email.body).toContain("Morgan");
    expect(email.body).toContain("compensation range");
  });

  it("generates a polite decline recruiter reply", () => {
    const email = generateEmail("recruiter_reply", {
      recruiterName: "Morgan",
      recruiterCompany: "Northstar",
      recruiterStance: "not_a_fit",
    });

    expect(email.body).toContain("appreciate");
    expect(email.body).toContain("right fit");
  });

  it("generates a reference request with role context", () => {
    const email = generateEmail("reference_request", {
      referenceName: "Avery",
      applyingRole: "Product Manager",
      targetCompany: "Nimbus",
      interviewStage: "final round",
    });

    expect(email.subject).toContain("Product Manager");
    expect(email.body).toContain("Avery");
    expect(email.body).toContain("Nimbus");
  });
});
