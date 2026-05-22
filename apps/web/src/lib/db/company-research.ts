import { getClient } from "./client";
import { generateId } from "@/lib/utils";

import { nowDate, nowIso, parseToDate } from "@/lib/format/time";
import type { EnrichmentSnapshot } from "@/lib/enrichment/types";

let companyResearchSchemaEnsured = false;

export async function ensureCompanyResearchSchema(): Promise<void> {
  if (companyResearchSchemaEnsured) return;

  try {
    const columnsResult = await getClient().execute(
      "PRAGMA table_info(company_research)",
    );
    const columnNames = new Set(
      (columnsResult.rows as unknown as Array<{ name: string }>).map(
        (column) => column.name,
      ),
    );

    if (!columnNames.has("enrichment_json")) {
      await getClient().execute(
        "ALTER TABLE company_research ADD COLUMN enrichment_json text",
      );
    }
    if (!columnNames.has("enriched_at")) {
      await getClient().execute(
        "ALTER TABLE company_research ADD COLUMN enriched_at text",
      );
    }
    if (!columnNames.has("github_slug")) {
      await getClient().execute(
        "ALTER TABLE company_research ADD COLUMN github_slug text",
      );
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

interface CompanyResearchRow {
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

function rowToCompanyResearch(row: CompanyResearchRow): CompanyResearch {
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

export async function getCompanyResearch(
  companyName: string,
  userId: string,
): Promise<CompanyResearch | null> {
  await ensureCompanyResearchSchema();
  const normalized = companyName.toLowerCase().trim();
  const result = await getClient().execute({
    sql: "SELECT * FROM company_research WHERE user_id = ? AND LOWER(company_name) = ?",
    args: [userId, normalized],
  });
  const row = result.rows[0] as unknown as CompanyResearchRow | undefined;
  return row ? rowToCompanyResearch(row) : null;
}

export async function saveCompanyResearch(
  research: Omit<CompanyResearch, "id" | "createdAt" | "updatedAt">,
  userId: string,
): Promise<CompanyResearch> {
  await ensureCompanyResearchSchema();
  const id = generateId();
  const now = nowIso();
  const normalizedCompanyName = research.companyName.toLowerCase().trim();

  await getClient().execute({
    sql: `
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
    `,
    args: [
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
    ],
  });

  const saved = await getCompanyResearch(normalizedCompanyName, userId);
  if (!saved) {
    throw new Error("Failed to save company research");
  }

  return saved;
}

export async function deleteCompanyResearch(
  id: string,
  userId: string,
): Promise<void> {
  await ensureCompanyResearchSchema();
  await getClient().execute({
    sql: "DELETE FROM company_research WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });
}

export async function getCompanyEnrichment(
  companyName: string,
  userId: string,
): Promise<{ snapshot: EnrichmentSnapshot; enrichedAt: string } | null> {
  await ensureCompanyResearchSchema();
  const normalized = companyName.toLowerCase().trim();
  const result = await getClient().execute({
    sql: "SELECT enrichment_json, enriched_at FROM company_research WHERE user_id = ? AND LOWER(company_name) = ?",
    args: [userId, normalized],
  });
  const row = result.rows[0] as unknown as
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

export async function saveCompanyEnrichment(
  userId: string,
  companyName: string,
  snapshot: EnrichmentSnapshot,
): Promise<{ snapshot: EnrichmentSnapshot; enrichedAt: string }> {
  await ensureCompanyResearchSchema();
  const id = generateId();
  const now = nowIso();
  const normalizedCompanyName = companyName.toLowerCase().trim();
  const enrichedAt = snapshot.enrichedAt;
  const resolvedGithubSlug =
    snapshot.github?.ok && snapshot.github.data.resolvedSlug
      ? snapshot.github.data.resolvedSlug
      : null;

  await getClient().execute({
    sql: `
      INSERT INTO company_research (
        id, user_id, company_name, key_facts_json, interview_questions_json,
        enrichment_json, enriched_at, github_slug, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, company_name) DO UPDATE SET
        enrichment_json = excluded.enrichment_json,
        enriched_at = excluded.enriched_at,
        github_slug = COALESCE(excluded.github_slug, company_research.github_slug),
        updated_at = excluded.updated_at
    `,
    args: [
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
    ],
  });

  return { snapshot, enrichedAt };
}

export async function getCompanyGithubSlug(
  companyName: string,
  userId: string,
): Promise<string | null> {
  await ensureCompanyResearchSchema();
  const normalized = companyName.toLowerCase().trim();
  const result = await getClient().execute({
    sql: "SELECT github_slug FROM company_research WHERE user_id = ? AND LOWER(company_name) = ?",
    args: [userId, normalized],
  });
  const row = result.rows[0] as unknown as
    | { github_slug: string | null }
    | undefined;

  return row?.github_slug ?? null;
}

export async function setCompanyGithubSlug(
  userId: string,
  companyName: string,
  slug: string | null,
): Promise<string | null> {
  await ensureCompanyResearchSchema();
  const id = generateId();
  const now = nowIso();
  const normalizedCompanyName = companyName.toLowerCase().trim();
  const normalizedSlug = slug?.trim().toLowerCase() || null;

  await getClient().execute({
    sql: `
      INSERT INTO company_research (
        id, user_id, company_name, key_facts_json, interview_questions_json,
        github_slug, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, company_name) DO UPDATE SET
        github_slug = excluded.github_slug,
        updated_at = excluded.updated_at
    `,
    args: [
      id,
      userId,
      normalizedCompanyName,
      "[]",
      "[]",
      normalizedSlug,
      now,
      now,
    ],
  });

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
