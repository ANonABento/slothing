import { describe, expect, it } from "vitest";
import {
  detectAndDescribe,
  detectAtsPlatform,
  getPlatformInfo,
} from "./platform-detection";

describe("detectAtsPlatform", () => {
  it("detects Workday from myworkdayjobs.com", () => {
    expect(
      detectAtsPlatform(
        "https://nike.wd1.myworkdayjobs.com/en-US/Nike/details/Senior-Engineer",
      ),
    ).toBe("workday");
  });

  it("detects Greenhouse from boards.greenhouse.io", () => {
    expect(
      detectAtsPlatform("https://boards.greenhouse.io/airbnb/jobs/12345"),
    ).toBe("greenhouse");
  });

  it("detects Lever from jobs.lever.co", () => {
    expect(
      detectAtsPlatform("https://jobs.lever.co/netflix/some-role-id"),
    ).toBe("lever");
  });

  it("detects Ashby from jobs.ashbyhq.com", () => {
    expect(detectAtsPlatform("https://jobs.ashbyhq.com/openai/role-id")).toBe(
      "ashby",
    );
  });

  it("detects Taleo from *.taleo.net", () => {
    expect(
      detectAtsPlatform("https://marriott.taleo.net/careersection/job-id"),
    ).toBe("taleo");
  });

  it("detects iCIMS from *.icims.com", () => {
    expect(
      detectAtsPlatform("https://careers-target.icims.com/jobs/12345/sr-eng"),
    ).toBe("icims");
  });

  it("detects SuccessFactors from successfactors.com", () => {
    expect(
      detectAtsPlatform("https://career.successfactors.com/career?123"),
    ).toBe("successfactors");
  });

  it("detects SuccessFactors from jobs.sap.com", () => {
    expect(
      detectAtsPlatform("https://jobs.sap.com/job/Senior-Engineer/123"),
    ).toBe("successfactors");
  });

  it("detects Kenexa/BrassRing", () => {
    expect(
      detectAtsPlatform("https://sjobs.brassring.com/TGnewUI/Search/Home"),
    ).toBe("kenexa");
  });

  it("returns 'unknown' for unrecognized hosts", () => {
    expect(detectAtsPlatform("https://example.com/jobs/123")).toBe("unknown");
    expect(detectAtsPlatform("https://careers.example.org")).toBe("unknown");
  });

  it("returns 'unknown' for empty / invalid input", () => {
    expect(detectAtsPlatform("")).toBe("unknown");
    expect(detectAtsPlatform("not a url at all")).toBe("unknown");
  });

  it("accepts URLs without protocol", () => {
    expect(detectAtsPlatform("boards.greenhouse.io/stripe/jobs/123")).toBe(
      "greenhouse",
    );
  });
});

describe("getPlatformInfo", () => {
  it("returns null for unknown", () => {
    expect(getPlatformInfo("unknown")).toBeNull();
  });

  it("returns platform info with recommendations", () => {
    const info = getPlatformInfo("workday");
    expect(info).not.toBeNull();
    expect(info?.label).toContain("Workday");
    expect(info?.recommendations.length).toBeGreaterThan(0);
  });

  it("Taleo recommendations call out literal keyword matching", () => {
    const info = getPlatformInfo("taleo");
    expect(info?.recommendations.join(" ")).toMatch(/JavaScript|literal/i);
  });

  it("Workday recommendations call out the column issue", () => {
    const info = getPlatformInfo("workday");
    expect(info?.recommendations.join(" ").toLowerCase()).toContain(
      "single-column",
    );
  });
});

describe("detectAndDescribe", () => {
  it("returns null for an unknown host", () => {
    expect(detectAndDescribe("https://example.com")).toBeNull();
  });

  it("returns full info for a known host", () => {
    const info = detectAndDescribe(
      "https://nike.wd1.myworkdayjobs.com/en-US/Nike/details/Senior-Eng",
    );
    expect(info?.platform).toBe("workday");
    expect(info?.recommendations.length).toBeGreaterThan(3);
  });
});
