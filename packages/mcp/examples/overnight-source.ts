/**
 * Example: overnight sourcing loop (autonomy level L1 — "Source").
 *
 * This is the simplest end-to-end agent loop against Slothing, using only the
 * tools that ship today. Point it at a list of job URLs and it will, for each:
 *
 *   1. scrape the URL into a structured preview (server-side),
 *   2. score it against your profile keywords,
 *   3. push the ones that clear a threshold into your review queue (pending),
 *
 * then print a summary. Run it on a cron (e.g. 2am) and wake up to a ranked
 * review queue at /opportunities/review.
 *
 * It deliberately uses the package's own `createApiClient` rather than the MCP
 * protocol layer, so it doubles as documentation of exactly which endpoints the
 * MCP tools wrap. A real agent (Claude Agent SDK, Choomfie, Hermes, ...) would
 * instead call the equivalent MCP tools: `slothing_scrape_url`,
 * `get_profile`, `slothing_push_job`.
 *
 * Usage:
 *   SLOTHING_TOKEN=... SLOTHING_API_URL=http://localhost:3000 \
 *     node --experimental-strip-types examples/overnight-source.ts url1 url2 ...
 *
 * (Node >=22.6 strips TS types natively; otherwise compile first or use tsx.)
 */
import {
  createApiClient,
  loadConfig,
  checkToken,
  ApiError,
  type ApiClient,
} from "../src/index.js";

/** Minimum profile-keyword overlap (0..1) before a job is pushed. */
const MATCH_THRESHOLD = 0.15;

interface ScrapedOpportunity {
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  keywords?: string[];
  url?: string;
  salary?: string;
  deadline?: string;
}

interface ProfileResponse {
  profile?: {
    skills?: string[];
    keywords?: string[];
  };
}

/** Lower-cased word set from a profile's skills + keywords, for naive scoring. */
async function loadProfileTerms(client: ApiClient): Promise<Set<string>> {
  try {
    const res = await client.get<ProfileResponse>("/api/extension/profile");
    const raw = [
      ...(res.profile?.skills ?? []),
      ...(res.profile?.keywords ?? []),
    ];
    return new Set(raw.map((t) => t.toLowerCase().trim()).filter(Boolean));
  } catch {
    return new Set();
  }
}

/**
 * Naive match score: fraction of the opportunity's keywords/requirements that
 * appear in the profile term set. A real agent would use the LLM here; this
 * keeps the example dependency-free and deterministic.
 */
function scoreMatch(opp: ScrapedOpportunity, terms: Set<string>): number {
  if (terms.size === 0) return 1; // no profile signal → don't filter anything out
  const oppTerms = [...(opp.keywords ?? []), ...(opp.requirements ?? [])]
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter(Boolean);
  if (oppTerms.length === 0) return 0;
  const hits = oppTerms.filter((t) => terms.has(t)).length;
  return hits / oppTerms.length;
}

async function main(): Promise<void> {
  const urls = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  if (urls.length === 0) {
    process.stderr.write(
      "usage: overnight-source <jobUrl> [jobUrl ...]\n",
    );
    process.exit(1);
  }

  const config = loadConfig();

  const tokenStatus = await checkToken(config);
  if (!tokenStatus.ok) {
    process.stderr.write(
      `[overnight-source] token check failed: ${tokenStatus.message}\n`,
    );
    process.exit(1);
  }

  const client = createApiClient({
    baseUrl: config.baseUrl,
    token: config.token,
  });
  const terms = await loadProfileTerms(client);

  let pushed = 0;
  let skipped = 0;
  let failed = 0;

  for (const url of urls) {
    try {
      const { opportunity } = await client.post<{
        opportunity: ScrapedOpportunity;
      }>("/api/extension/opportunities/scrape", { url });

      const score = scoreMatch(opportunity, terms);
      if (score < MATCH_THRESHOLD) {
        skipped += 1;
        process.stdout.write(
          `skip  (${score.toFixed(2)})  ${opportunity.title ?? url}\n`,
        );
        continue;
      }

      await client.post<unknown>("/api/opportunities/from-extension", {
        title: opportunity.title ?? "Untitled role",
        company: opportunity.company ?? "Unknown",
        location: opportunity.location,
        description: opportunity.description,
        requirements: opportunity.requirements,
        responsibilities: opportunity.responsibilities,
        keywords: opportunity.keywords,
        url: opportunity.url ?? url,
        salary: opportunity.salary,
        deadline: opportunity.deadline,
        source: "agent",
        status: "pending",
      });
      pushed += 1;
      process.stdout.write(
        `push  (${score.toFixed(2)})  ${opportunity.title ?? url}\n`,
      );
    } catch (error) {
      failed += 1;
      const detail =
        error instanceof ApiError
          ? `${error.status} ${error.message}`
          : String(error);
      process.stderr.write(`fail        ${url} — ${detail}\n`);
    }
  }

  process.stdout.write(
    `\n[overnight-source] pushed=${pushed} skipped=${skipped} failed=${failed}\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`[overnight-source] fatal: ${String(error)}\n`);
  process.exit(1);
});
