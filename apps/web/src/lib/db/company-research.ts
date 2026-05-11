import db from "./legacy";
import { generateId } from "@/lib/utils";

import { nowDate, nowIso, parseToDate } from "@/lib/format/time";
import type { EnrichmentSnapshot } from "@/lib/enrichment/types";

let companyResearchSchemaEnsured = false;

export function ensureCompanyResearchSchema(): void {
  if (companyResearchSchemaEnsured) return;

  try {
    const columns = db
      .prepare("PRAGMA table_info(company_research)")
      .all() as Array<{
      name: string;
    }>;
    const columnNames = new Set(columns.map((column) => column.name));

    if (!columnNames.has("enrichment_json")) {
      db.prepare(
        "ALTER TABLE company_research ADD COLUMN enrichment_json text",
      ).run();
    }
    if (!columnNames.has("enriched_at")) {
      db.prepare(
        "ALTER TABLE company_research ADD COLUMN enriched_at text",
      ).run();
    }
    if (!columnNames.has("github_slug")) {
      db.prepare(
        "ALTER TABLE company_research ADD COLUMN github_slug text",
      ).run();
    }
    companyResearchSchemaEnsured = true;
  } catch {
    // Tests and first-boot environments may not have the table available yet.
  }
}

export interface CompanyResearch {
  id: string;
  companyName: string;
  summary?: string;
  keyFacts: string[];
  interviewQuestions: string[];
  cultureNotes?: string;
  recentNews?: string;
  createdAt: string;
  updatedAt: string;
}

export function getCompanyResearch(
  companyName: string,
  userId: string,
): CompanyResearch | null {
  ensureCompanyResearchSchema();
  const normalized = companyName.toLowerCase().trim();
  const stmt = db.prepare(
    "SELECT * FROM company_research WHERE user_id = ? AND LOWER(company_name) = ?",
  );
  const row = stmt.get(userId, normalized) as
    | {
        id: string;
        user_id: string;
        company_name: string;
        summary: string | null;
        key_facts_json: string | null;
        interview_questions_json: string | null;
        culture_notes: string | null;
        recent_news: string | null;
        created_at: string;
        updated_at: string;
      }
    | undefined;

  if (!row) return null;

  return {
    id: row.id,
    companyName: row.company_name,
    summary: row.summary || undefined,
    keyFacts: row.key_facts_json ? JSON.parse(row.key_facts_json) : [],
    interviewQuestions: row.interview_questions_json
      ? JSON.parse(row.interview_questions_json)
      : [],
    cultureNotes: row.culture_notes || undefined,
    recentNews: row.recent_news || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function saveCompanyResearch(
  research: Omit<CompanyResearch, "id" | "createdAt" | "updatedAt">,
  userId: string,
): CompanyResearch {
  ensureCompanyResearchSchema();
  const id = generateId();
  const now = nowIso();
  const normalizedCompanyName = research.companyName.toLowerCase().trim();

  const stmt = db.prepare(`
    INSERT INTO company_research (
      id, user_id, company_name, summary, key_facts_json, interview_questions_json,
      culture_notes, recent_news, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, company_name) DO UPDATE SET
      summary = excluded.summary,
      key_facts_json = excluded.key_facts_json,
      interview_questions_json = excluded.interview_questions_json,
      culture_notes = excluded.culture_notes,
      recent_news = excluded.recent_news,
      updated_at = excluded.updated_at
  `);

  stmt.run(
    id,
    userId,
    normalizedCompanyName,
    research.summary || null,
    JSON.stringify(research.keyFacts),
    JSON.stringify(research.interviewQuestions),
    research.cultureNotes || null,
    research.recentNews || null,
    now,
    now,
  );

  const saved = getCompanyResearch(normalizedCompanyName, userId);
  if (!saved) {
    throw new Error("Failed to save company research");
  }

  return saved;
}

export function deleteCompanyResearch(
  id: string,
  userId: string,
): void {
  ensureCompanyResearchSchema();
  const stmt = db.prepare(
    "DELETE FROM company_research WHERE id = ? AND user_id = ?",
  );
  stmt.run(id, userId);
}

export function getCompanyEnrichment(
  companyName: string,
  userId: string,
): { snapshot: EnrichmentSnapshot; enrichedAt: string } | null {
  ensureCompanyResearchSchema();
  const normalized = companyName.toLowerCase().trim();
  const stmt = db.prepare(
    "SELECT enrichment_json, enriched_at FROM company_research WHERE user_id = ? AND LOWER(company_name) = ?",
  );
  const row = stmt.get(userId, normalized) as
    | {
        enrichment_json: string | null;
        enriched_at: string | null;
      }
    | undefined;

  if (!row?.enrichment_json || !row.enriched_at) return null;

  return {
    snapshot: JSON.parse(row.enrichment_json) as EnrichmentSnapshot,
    enrichedAt: row.enriched_at,
  };
}

export function saveCompanyEnrichment(
  userId: string,
  companyName: string,
  snapshot: EnrichmentSnapshot,
): { snapshot: EnrichmentSnapshot; enrichedAt: string } {
  ensureCompanyResearchSchema();
  const id = generateId();
  const now = nowIso();
  const normalizedCompanyName = companyName.toLowerCase().trim();
  const enrichedAt = snapshot.enrichedAt;
  const resolvedGithubSlug =
    snapshot.github?.ok && snapshot.github.data.resolvedSlug
      ? snapshot.github.data.resolvedSlug
      : null;

  const stmt = db.prepare(`
    INSERT INTO company_research (
      id, user_id, company_name, key_facts_json, interview_questions_json,
      enrichment_json, enriched_at, github_slug, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, company_name) DO UPDATE SET
      enrichment_json = excluded.enrichment_json,
      enriched_at = excluded.enriched_at,
      github_slug = COALESCE(excluded.github_slug, company_research.github_slug),
      updated_at = excluded.updated_at
  `);

  stmt.run(
    id,
    userId,
    normalizedCompanyName,
    "[]",
    "[]",
    JSON.stringify(snapshot),
    enrichedAt,
    resolvedGithubSlug,
    now,
    now,
  );

  return { snapshot, enrichedAt };
}

export function getCompanyGithubSlug(
  companyName: string,
  userId: string,
): string | null {
  ensureCompanyResearchSchema();
  const normalized = companyName.toLowerCase().trim();
  const stmt = db.prepare(
    "SELECT github_slug FROM company_research WHERE user_id = ? AND LOWER(company_name) = ?",
  );
  const row = stmt.get(userId, normalized) as
    | { github_slug: string | null }
    | undefined;

  return row?.github_slug ?? null;
}

export function setCompanyGithubSlug(
  userId: string,
  companyName: string,
  slug: string | null,
): string | null {
  ensureCompanyResearchSchema();
  const id = generateId();
  const now = nowIso();
  const normalizedCompanyName = companyName.toLowerCase().trim();
  const normalizedSlug = slug?.trim().toLowerCase() || null;

  const stmt = db.prepare(`
    INSERT INTO company_research (
      id, user_id, company_name, key_facts_json, interview_questions_json,
      github_slug, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, company_name) DO UPDATE SET
      github_slug = excluded.github_slug,
      updated_at = excluded.updated_at
  `);

  stmt.run(
    id,
    userId,
    normalizedCompanyName,
    "[]",
    "[]",
    normalizedSlug,
    now,
    now,
  );

  return normalizedSlug;
}

export function isEnrichmentStale(
  enrichedAt: string | null | undefined,
  maxAgeHours = 24,
): boolean {
  const date = parseToDate(enrichedAt);
  if (!date) return true;
  const ageHours = (nowDate().getTime() - date.getTime()) / (1000 * 60 * 60);
  return ageHours > maxAgeHours;
}

export function isResearchStale(
  research: CompanyResearch,
  maxAgeDays = 7,
): boolean {
  const updatedAt = parseToDate(research.updatedAt)!;
  const now = nowDate();
  const ageInDays =
    (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
  return ageInDays > maxAgeDays;
}
