import { describe, expect, it } from "vitest";
import {
  evaluateUnattendedSubmission,
  filterReasons,
  parseSalary,
  passesSourcingFilters,
} from "./rules";
import { DEFAULT_AGENT_POLICY, type AgentPolicy } from "./policy";

const AUTO: AgentPolicy = {
  ...DEFAULT_AGENT_POLICY,
  autonomy: "auto_submit",
  dryRun: false,
  matchThreshold: 0.5,
  salaryFloor: 100000,
  companyBlocklist: ["acme"],
  dailySubmitCap: 5,
};

function ctx(
  over: Partial<Parameters<typeof evaluateUnattendedSubmission>[0]> = {},
) {
  return {
    policy: AUTO,
    draftStatus: "approved",
    company: "Globex",
    salary: 150000,
    matchScore: 0.8,
    submittedToday: 0,
    ...over,
  };
}

describe("filterReasons", () => {
  it("flags blocklist, salary floor, and match threshold", () => {
    expect(
      filterReasons(AUTO, { company: "Acme", salary: 150000, matchScore: 0.8 }),
    ).toEqual(["company_blocklisted"]);
    expect(
      filterReasons(AUTO, {
        company: "Globex",
        salary: 80000,
        matchScore: 0.8,
      }),
    ).toEqual(["below_salary_floor"]);
    expect(
      filterReasons(AUTO, {
        company: "Globex",
        salary: 150000,
        matchScore: 0.3,
      }),
    ).toEqual(["below_match_threshold"]);
  });

  it("passes a clean candidate", () => {
    expect(
      passesSourcingFilters(AUTO, {
        company: "Globex",
        salary: 150000,
        matchScore: 0.8,
      }),
    ).toBe(true);
  });
});

describe("evaluateUnattendedSubmission", () => {
  it("authorizes a clean approved candidate at auto_submit", () => {
    expect(evaluateUnattendedSubmission(ctx())).toEqual({
      authorized: true,
      reasons: [],
    });
  });

  it("blocks a non-approved draft", () => {
    expect(
      evaluateUnattendedSubmission(ctx({ draftStatus: "pending_review" }))
        .reasons,
    ).toContain("not_approved");
  });

  it("blocks below auto_submit autonomy", () => {
    expect(
      evaluateUnattendedSubmission(
        ctx({ policy: { ...AUTO, autonomy: "submit_approval" } }),
      ).reasons,
    ).toContain("autonomy_below_auto_submit");
  });

  it("treats dry-run as a hard stop (zero real submits)", () => {
    const result = evaluateUnattendedSubmission(
      ctx({ policy: { ...AUTO, dryRun: true } }),
    );
    expect(result.authorized).toBe(false);
    expect(result.reasons).toContain("dry_run_enabled");
  });

  it("enforces the daily cap", () => {
    expect(
      evaluateUnattendedSubmission(ctx({ submittedToday: 5 })).reasons,
    ).toContain("daily_cap_reached");
  });

  it("accumulates multiple blocking reasons", () => {
    const result = evaluateUnattendedSubmission(
      ctx({ company: "Acme", matchScore: 0.1, submittedToday: 10 }),
    );
    expect(result.authorized).toBe(false);
    expect(result.reasons).toEqual(
      expect.arrayContaining([
        "company_blocklisted",
        "below_match_threshold",
        "daily_cap_reached",
      ]),
    );
  });
});

describe("parseSalary", () => {
  it("parses currency, commas, and k-suffixes to the lowest number", () => {
    expect(parseSalary("$120,000")).toBe(120000);
    expect(parseSalary("120k - 150k")).toBe(120000);
    expect(parseSalary("USD 95000 per year")).toBe(95000);
    expect(parseSalary("competitive")).toBeNull();
    expect(parseSalary(null)).toBeNull();
  });
});
