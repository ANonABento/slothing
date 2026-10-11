/**
 * @route POST /api/extension/best-fit
 * @description Rank the user's recent tailored resumes by fit against a scraped
 *   job, powering experiment #1's profile picker + best-fit badge. Body is the
 *   scraped job (same shape as the extension opportunity payload). Returns the
 *   resumes best-fit-first; the first entry is the recommended base resume.
 * @auth Extension token
 * @response { resumes: Array<{ id, name, score }> }
 */
import { NextRequest, NextResponse } from "next/server";
import { requireExtensionAuth } from "@/lib/extension-auth";
import { getClient } from "@/lib/db/client";
import { getProfile } from "@/lib/db/queries/profile";
import { nowIso } from "@/lib/format/time";
import {
  buildJobFromExtension,
  extensionOpportunitySchema,
} from "@/lib/extension-opportunities";
import {
  rankResumesByFit,
  type BestFitCandidate,
} from "@/lib/extension/best-fit";

export const dynamic = "force-dynamic";

const MAX_RESUMES = 5;

interface CandidateRow {
  id: string;
  content_json: string;
  job_title: string | null;
  job_company: string | null;
}

export async function POST(request: NextRequest) {
  const authResult = await requireExtensionAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = extensionOpportunitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const profile = await getProfile(authResult.userId);
    if (!profile) {
      // No profile to score against — nothing to recommend.
      return NextResponse.json({ resumes: [] });
    }

    const result = await getClient().execute({
      sql: `
        SELECT
          gr.id           AS id,
          gr.content_json AS content_json,
          j.title         AS job_title,
          j.company       AS job_company
        FROM generated_resumes gr
        LEFT JOIN jobs j ON j.id = gr.job_id AND j.user_id = gr.user_id
        WHERE gr.user_id = ?
        ORDER BY gr.created_at DESC
        LIMIT ?
      `,
      args: [authResult.userId, MAX_RESUMES],
    });
    const rows = result.rows as unknown as CandidateRow[];

    const candidates: BestFitCandidate[] = rows.map((row) => {
      const role = row.job_title?.trim() || "Untitled resume";
      const company = row.job_company?.trim();
      return {
        id: row.id,
        name: company ? `${role} · ${company}` : role,
        contentJson: row.content_json ?? "",
      };
    });

    const job = {
      ...buildJobFromExtension(parsed.data),
      id: "",
      createdAt: nowIso(),
    };
    const resumes = rankResumesByFit({ profile, job, candidates });

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error("Extension best-fit error:", error);
    return NextResponse.json(
      { error: "Failed to rank resumes" },
      { status: 500 },
    );
  }
}
