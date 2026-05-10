import { describe, expect, it } from "vitest";
import {
  welcomeDay1,
  welcomeDay3,
  welcomeDay7,
  welcomeDay14,
} from "./templates";

const unsubscribeUrl = "https://app.example.com/api/email/unsubscribe?t=abc";

describe("welcome email templates", () => {
  it("renders expected subjects", () => {
    expect(
      welcomeDay1({
        firstName: "Ada",
        profileUrl: "https://app.example.com/profile",
        unsubscribeUrl,
      }).subject,
    ).toBe("Welcome — set up your profile in 5 min");
    expect(
      welcomeDay3({
        firstName: "Ada",
        opportunitiesUrl: "https://app.example.com/opportunities",
        unsubscribeUrl,
      }).subject,
    ).toBe("Apply to your first opportunity today");
    expect(
      welcomeDay7({
        firstName: "Ada",
        interviewUrl: "https://app.example.com/interview",
        unsubscribeUrl,
      }).subject,
    ).toBe("Practice for your first interview");
    expect(
      welcomeDay14({
        firstName: "Ada",
        applicationCount: 3,
        tailoredResumeCount: 5,
        upgradeUrl: "https://app.example.com/settings#plan",
        unsubscribeUrl,
      }).subject,
    ).toBe("Unlock more tailored applications with Pro");
  });

  it("renders cross-client-safe HTML with unsubscribe links", () => {
    const emails = [
      welcomeDay1({
        firstName: "Ada",
        profileUrl: "https://app.example.com/profile",
        unsubscribeUrl,
      }),
      welcomeDay3({
        firstName: "Ada",
        opportunitiesUrl: "https://app.example.com/opportunities",
        unsubscribeUrl,
      }),
      welcomeDay7({
        firstName: "Ada",
        interviewUrl: "https://app.example.com/interview",
        unsubscribeUrl,
      }),
      welcomeDay14({
        firstName: "Ada",
        applicationCount: 3,
        tailoredResumeCount: 5,
        upgradeUrl: "https://app.example.com/settings#plan",
        unsubscribeUrl,
      }),
    ];

    for (const email of emails) {
      expect(email.html).toContain("<html>");
      expect(email.html).toContain("<body");
      expect(email.html).toContain("Ada");
      expect(email.html).toContain(unsubscribeUrl.replace("&", "&amp;"));
      expect(email.html).not.toContain("<style");
      expect(email.html).not.toContain("<script");
      expect(email.html).not.toMatch(/position\s*:/i);
      expect(email.html).not.toMatch(/display\s*:\s*flex/i);
      expect(email.html).not.toMatch(/display\s*:\s*grid/i);
      expect(email.html.match(/<a\s+href=/g)?.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("interpolates Day 14 usage stats", () => {
    const email = welcomeDay14({
      firstName: "Ada",
      applicationCount: 3,
      tailoredResumeCount: 5,
      upgradeUrl: "https://app.example.com/settings#plan",
      unsubscribeUrl,
    });

    expect(email.html).toContain("3 opportunities");
    expect(email.html).toContain("5 resumes");
    expect(email.text).toContain("3 opportunities");
    expect(email.text).toContain("5 resumes");
  });
});
