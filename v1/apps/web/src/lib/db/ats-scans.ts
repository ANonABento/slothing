import { getClient } from "./client";
import { generateId } from "@/lib/utils";
import type { ATSScanReport } from "@/lib/ats/analyzer";
import type { ATSScanResult } from "@/lib/ats/analyzer";
import type { FixSuggestion } from "@/lib/ats/fix-suggestions";

interface RawScanRow {
  id: string;
  user_id: string;
  job_id: string | null;
  overall_score: number;
  letter_grade: string;
  formatting_score: number;
  structure_score: number;
  content_score: number;
  keywords_score: number;
  issue_count: number;
  fix_count: number;
  report_json: string;
  scanned_at: string;
}

export interface StoredScanRecord {
  id: string;
  userId: string;
  jobId: string | null;
  overallScore: number;
  letterGrade: string;
  formattingScore: number;
  structureScore: number;
  contentScore: number;
  keywordsScore: number;
  issueCount: number;
  fixCount: number;
  report: ATSScanReport & { fixes: FixSuggestion[] };
  scannedAt: string;
}

export async function saveScanResult(
  userId: string,
  report: ATSScanReport,
  fixes: FixSuggestion[],
  jobId?: string,
): Promise<string> {
  const id = generateId();
  const reportWithFixes = { ...report, fixes };
  const args: Array<string | number | null> = [
    id,
    userId,
    jobId || null,
    report.score.overall,
    report.letterGrade,
    report.score.formatting,
    report.score.structure,
    report.score.content,
    report.score.keywords,
    report.issues.length,
    fixes.length,
    JSON.stringify(reportWithFixes),
    report.scannedAt,
  ];

  if (jobId) {
    args.push(jobId, userId);
  }

  const result = await getClient().execute({
    sql: `INSERT INTO ats_scan_history
      (id, user_id, job_id, overall_score, letter_grade, formatting_score, structure_score, content_score, keywords_score, issue_count, fix_count, report_json, scanned_at)
      SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      ${jobId ? "WHERE EXISTS (SELECT 1 FROM jobs WHERE id = ? AND user_id = ?)" : ""}`,
    args,
  });

  if (result.rowsAffected === 0) {
    throw new Error("Job not found");
  }

  return id;
}

/**
 * Save a scan that originated from the in-app /ats page (browser-side
 * `ScannerForm`). The form returns an `ATSScanResult` plus a free-text
 * JD; we persist score columns + a wrapped JSON payload that stores the
 * label, optional opportunity id, and full result for replay.
 */
export interface InAppScanSavePayload {
  result: ATSScanResult;
  jobLabel?: string;
  jobCompany?: string;
  jobTitle?: string;
  opportunityId?: string;
  jdText?: string;
}

export async function saveInAppScan(
  userId: string,
  payload: InAppScanSavePayload,
): Promise<string> {
  const id = generateId();
  const { result } = payload;
  const opportunityId = payload.opportunityId?.trim();

  const wrappedReport = {
    label:
      payload.jobLabel ||
      (payload.jobTitle && payload.jobCompany
        ? `${payload.jobTitle} @ ${payload.jobCompany}`
        : payload.jobTitle || payload.jobCompany || "Standalone scan"),
    jobTitle: payload.jobTitle ?? null,
    jobCompany: payload.jobCompany ?? null,
    jdText: payload.jdText ?? null,
    result,
  };

  const args: Array<string | number | null> = [
    id,
    userId,
    opportunityId || null,
    result.overall,
    result.letterGrade,
    result.legacy.score.formatting,
    Math.round(
      (result.axes.sectionCompleteness.score +
        result.axes.datesAndTenure.score) /
        2,
    ),
    result.legacy.score.content,
    result.legacy.score.keywords,
    result.issues.length,
    0,
    JSON.stringify(wrappedReport),
    result.scannedAt,
  ];

  if (opportunityId) {
    args.push(opportunityId, userId);
  }

  const sqlResult = await getClient().execute({
    sql: `INSERT INTO ats_scan_history
      (id, user_id, job_id, overall_score, letter_grade, formatting_score, structure_score, content_score, keywords_score, issue_count, fix_count, report_json, scanned_at)
      SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      ${opportunityId ? "WHERE EXISTS (SELECT 1 FROM jobs WHERE id = ? AND user_id = ?)" : ""}`,
    args,
  });

  if (sqlResult.rowsAffected === 0) {
    throw new Error("Opportunity not found");
  }

  return id;
}

export async function getScanHistory(
  userId: string,
  limit: number = 20,
): Promise<StoredScanRecord[]> {
  const result = await getClient().execute({
    sql: "SELECT * FROM ats_scan_history WHERE user_id = ? ORDER BY scanned_at DESC LIMIT ?",
    args: [userId, limit],
  });

  return (result.rows as unknown as RawScanRow[]).map(mapRow);
}

export async function getScanById(
  id: string,
  userId: string,
): Promise<StoredScanRecord | null> {
  const result = await getClient().execute({
    sql: "SELECT * FROM ats_scan_history WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });
  const row = result.rows[0] as unknown as RawScanRow | undefined;

  if (!row) return null;
  return mapRow(row);
}

function mapRow(row: RawScanRow): StoredScanRecord {
  return {
    id: row.id,
    userId: row.user_id,
    jobId: row.job_id,
    overallScore: row.overall_score,
    letterGrade: row.letter_grade,
    formattingScore: row.formatting_score,
    structureScore: row.structure_score,
    contentScore: row.content_score,
    keywordsScore: row.keywords_score,
    issueCount: row.issue_count,
    fixCount: row.fix_count,
    report: JSON.parse(row.report_json),
    scannedAt: row.scanned_at,
  };
}
