import { describe, expect, it } from "vitest";
import {
  DEFAULT_SITE_RULES,
  matchSiteRules,
  normalizeRuleHost,
  type SiteRule,
} from "./site-rules";

describe("normalizeRuleHost", () => {
  it("lowercases and strips scheme, www, and path", () => {
    expect(normalizeRuleHost("HTTPS://www.LinkedIn.com/jobs/view/1")).toBe(
      "linkedin.com",
    );
  });

  it("strips a wildcard prefix", () => {
    expect(normalizeRuleHost("*.greenhouse.io")).toBe("greenhouse.io");
  });

  it("drops the port for normal hosts", () => {
    expect(normalizeRuleHost("example.com:8443/path")).toBe("example.com");
  });

  it("keeps the port for localhost so dev app != all localhost", () => {
    expect(normalizeRuleHost("http://localhost:3000/dashboard")).toBe(
      "localhost:3000",
    );
    expect(normalizeRuleHost("127.0.0.1:3000")).toBe("127.0.0.1:3000");
  });

  it("handles empty input", () => {
    expect(normalizeRuleHost("")).toBe("");
    expect(normalizeRuleHost("   ")).toBe("");
  });
});

describe("matchSiteRules", () => {
  const rules: SiteRule[] = [
    { host: "linkedin.com", mode: "allow" },
    { host: "greenhouse.io", mode: "allow" },
  ];

  it("returns 'default' for unlisted hosts (preserves broad coverage)", () => {
    expect(matchSiteRules("random-careers.com", rules)).toBe("default");
  });

  it("matches an exact host", () => {
    expect(matchSiteRules("linkedin.com", rules)).toBe("allow");
  });

  it("matches by host suffix", () => {
    expect(matchSiteRules("boards.greenhouse.io", rules)).toBe("allow");
  });

  it("does not match a different host that merely contains the rule host", () => {
    // notgreenhouse.io should NOT match greenhouse.io
    expect(matchSiteRules("notgreenhouse.io", rules)).toBe("default");
  });

  it("longest-suffix rule wins (specific allow overrides a broad block)", () => {
    const mixed: SiteRule[] = [
      { host: "lever.co", mode: "block" },
      { host: "jobs.lever.co", mode: "allow" },
    ];
    expect(matchSiteRules("jobs.lever.co", mixed)).toBe("allow");
    expect(matchSiteRules("other.lever.co", mixed)).toBe("block");
  });

  it("an exact app-host block beats the default", () => {
    const withApp: SiteRule[] = [
      { host: "localhost:3000", mode: "block", system: true },
      ...rules,
    ];
    expect(matchSiteRules("localhost:3000", withApp)).toBe("block");
    // A different localhost port is unaffected.
    expect(matchSiteRules("localhost:8080", withApp)).toBe("default");
  });
});

describe("DEFAULT_SITE_RULES", () => {
  it("seeds the known-good hosts as allow", () => {
    expect(DEFAULT_SITE_RULES.length).toBeGreaterThan(0);
    expect(DEFAULT_SITE_RULES.every((r) => r.mode === "allow")).toBe(true);
    expect(DEFAULT_SITE_RULES.map((r) => r.host)).toContain(
      "waterlooworks.uwaterloo.ca",
    );
  });
});
