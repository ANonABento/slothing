import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");

const migratedProductionPaths = [
  "src/app/api/opportunities",
  "src/app/[locale]/(app)/opportunities/[id]/opengraph-image.tsx",
  "src/app/[locale]/(app)/opportunities/[id]/research/opengraph-image.tsx",
  "src/app/api/extension/auth/route.ts",
  "src/app/api/extension/auth/verify/route.ts",
  "src/app/api/extension/field-mappings/correct/route.ts",
  "src/app/api/extension/opportunities",
  "src/app/api/extension/profile/route.ts",
  "src/app/api/extension/resumes/route.ts",
  "src/app/api/account/route.ts",
  "src/app/api/analytics/route.ts",
  "src/app/api/analytics/export/route.ts",
  "src/app/api/analytics/success/route.ts",
  "src/app/api/analytics/trends/route.ts",
  "src/app/api/ats/analyze/route.ts",
  "src/app/api/ats/scan/route.ts",
  "src/app/api/ats/scans/route.ts",
  "src/app/api/companies/[id]/enrich/route.ts",
  "src/app/api/companies/[id]/enrich/slugs/route.ts",
  "src/app/api/cover-letter/generate/route.ts",
  "src/app/api/cover-letters/[id]/route.ts",
  "src/app/api/builder/route.ts",
  "src/app/api/cron/google/calendar-sync/route.ts",
  "src/app/api/billing/credits/route.cloud.ts",
  "src/app/api/cron/cleanup/route.ts",
  "src/app/api/cron/status/route.ts",
  "src/app/api/cron/digest/daily/route.ts",
  "src/app/api/cron/digest/weekly/route.ts",
  "src/app/api/cron/email/retry/route.ts",
  "src/app/api/cron/follow-ups/route.ts",
  "src/app/api/cron/gmail/status-detect/route.ts",
  "src/app/api/cron/reminders/tick/route.ts",
  "src/app/api/email/sends/route.ts",
  "src/app/api/calendar/export/route.ts",
  "src/app/api/calendar/feed/route.ts",
  "src/app/api/google/calendar/sync/route.ts",
  "src/app/api/google/sheets/export/route.ts",
  "src/app/api/insights/route.ts",
  "src/app/api/interview/answer/route.ts",
  "src/app/api/interview/followup/route.ts",
  "src/app/api/interview/prep-guide/route.ts",
  "src/app/api/interview/sessions/route.ts",
  "src/app/api/interview/sources/route.ts",
  "src/app/api/interview/start/route.ts",
  "src/app/api/learning/paths/route.ts",
  "src/app/api/monitoring/vitals/route.ts",
  "src/app/api/notifications/route.ts",
  "src/app/api/notifications/[id]/route.ts",
  "src/app/api/recommendations/route.ts",
  "src/app/api/reminders/route.ts",
  "src/app/api/reminders/[id]/route.ts",
  "src/app/api/profile/versions",
  "src/app/api/resume/export/route.ts",
  "src/app/api/resume/generate/route.ts",
  "src/app/api/tailor/route.ts",
  "src/app/api/resumes",
  "src/app/api/product-analytics/route.ts",
  "src/app/api/prompts",
  "src/app/api/waitlist/route.ts",
  "src/app/api/export/opportunities/route.ts",
  "src/app/api/export/route.ts",
  "src/app/api/email/drafts",
  "src/app/api/email/generate/route.ts",
  "src/app/api/bank/imports",
  "src/app/api/backup/route.ts",
  "src/app/api/dev/seed/route.ts",
  "src/app/api/documents/[id]/artifact/route.ts",
  "src/app/api/documents/[id]/extract/route.ts",
  "src/app/api/documents/[id]/parse-runs",
  "src/app/api/documents/[id]/route.ts",
  "src/app/api/documents/[id]/source-map/route.ts",
  "src/app/api/import/route.ts",
  "src/app/api/import/csv/route.ts",
  "src/app/api/import/job/route.ts",
  "src/app/api/import/opportunities/route.ts",
  "src/app/api/share",
  "src/app/share/[token]/page.tsx",
  "src/app/api/streak/route.ts",
  "src/lib/db/jobs-async.ts",
  "src/lib/db/salary.ts",
  "src/lib/db/ats-scans.ts",
  "src/lib/db/opportunity-contacts.ts",
  "src/lib/db/custom-templates.ts",
  "src/lib/db/company-research.ts",
  "src/lib/db/product-analytics.ts",
  "src/lib/db/waitlist.ts",
  "src/lib/db/web-vitals.ts",
  "src/lib/db/notifications.ts",
  "src/lib/db/suggested-status-updates.ts",
  "src/lib/db/account-deletion.ts",
  "src/lib/db/analytics.ts",
  "src/lib/db/analytics-queries.ts",
  "src/lib/db/cover-letters.ts",
  "src/lib/db/document-artifacts.ts",
  "src/lib/db/document-parse-runs.ts",
  "src/lib/db/credits.ts",
  "src/lib/db/prompt-variants.ts",
  "src/lib/db/resumes.ts",
  "src/lib/db/reminders.ts",
  "src/lib/db/profile-versions.ts",
  "src/lib/db/subscriptions.ts",
  "src/lib/db/streak.ts",
  "src/lib/db/streak-schema.ts",
  "src/app/api/resume/track/route.ts",
  "src/app/api/resume/stats/route.ts",
  "src/lib/db/resume-tracking.ts",
  "src/app/api/salary/offers/route.ts",
  "src/app/api/salary/offers/[id]/route.ts",
  "src/lib/db/extension-sessions.ts",
  "src/lib/db/email-drafts.ts",
  "src/lib/db/email-sends.ts",
  "src/lib/db/cron-runs.ts",
  "src/lib/db/external-calendar-events.ts",
  "src/lib/db/shared-resumes.ts",
  "src/lib/cron/cleanup.ts",
  "src/lib/digest/daily.ts",
  "src/lib/digest/eligible-users.ts",
  "src/lib/email/gmail-status-detect.ts",
  "src/lib/extension-auth.ts",
  "src/lib/interview/context-pack-builder.ts",
  "src/lib/ingest/document-parse-run.ts",
  "src/lib/ingest/document-upload.ts",
  "src/lib/ingest/parser-v2-upload-review.ts",
  "src/lib/enrichment/index.ts",
  "src/lib/resume/templates.ts",
  "src/lib/opportunities.ts",
  "src/lib/billing/ai-gate.ts",
  "src/lib/billing/plans.ts",
  "src/cloud/billing/handlers.ts",
  "src/app/api/billing/checkout/route.cloud.ts",
  "src/app/api/billing/portal/route.cloud.ts",
  "src/app/api/billing/webhook/route.cloud.ts",
  "src/lib/plan/quota.ts",
  "src/lib/cron/email-retry.ts",
  "src/lib/reminders/fire-due.ts",
  "src/lib/streak/track.ts",
  "src/lib/welcome-series/state.ts",
  "src/lib/welcome-series/predicates.ts",
  "src/lib/welcome-series/process.ts",
];

const forbiddenImportPatterns = [
  /from\s+["']@\/lib\/db\/legacy["']/,
  /from\s+["']@\/lib\/db\/jobs["']/,
  /from\s+["']\.\/legacy["']/,
  /import\s*\(\s*["']@\/lib\/db\/legacy["']\s*\)/,
  /import\s*\(\s*["']@\/lib\/db\/jobs["']\s*\)/,
  /import\s*\(\s*["']\.\/legacy["']\s*\)/,
];

function collectSourceFiles(path: string): string[] {
  const absolutePath = join(repoRoot, path);
  if (!existsSync(absolutePath)) return [];

  const stat = statSync(absolutePath);
  if (stat.isFile()) {
    return (absolutePath.endsWith(".ts") || absolutePath.endsWith(".tsx")) &&
      !absolutePath.endsWith(".test.ts") &&
      !absolutePath.endsWith(".test.tsx")
      ? [absolutePath]
      : [];
  }

  return readdirSync(absolutePath).flatMap((entry) =>
    collectSourceFiles(join(path, entry)),
  );
}

describe("remote-safe DB boundaries", () => {
  it("keeps migrated opportunity backend paths off local-only DB adapters", () => {
    const offenders = migratedProductionPaths
      .flatMap(collectSourceFiles)
      .flatMap((file) => {
        const source = readFileSync(file, "utf8");
        return forbiddenImportPatterns
          .filter((pattern) => pattern.test(source))
          .map((pattern) => `${relative(repoRoot, file)} matches ${pattern}`);
      });

    expect(offenders).toEqual([]);
  });

  it("keeps the async jobs repository isolated from DB barrel side effects", () => {
    const source = readFileSync(
      join(repoRoot, "src/lib/db/jobs-async.ts"),
      "utf8",
    );

    expect(source).toContain("./client");
    expect(source).not.toContain("./index");
    expect(source).not.toContain("./legacy");
  });
});
