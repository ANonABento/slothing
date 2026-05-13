/**
 * @route GET /api/extension/resumes
 * @description List the user's 5 most-recently-updated tailored resumes for the
 *   popup's "Tailor resume" base picker (#34). Each entry includes the resume
 *   id plus the linked job's title/company so the popup can render a friendly
 *   dropdown label. Resumes that no longer have a linked job row are still
 *   surfaced — we just fall back to an "Untitled resume" name.
 * @auth Extension token
 * @response { resumes: Array<{ id, name, targetRole, updatedAt }> }
 */
import { NextRequest, NextResponse } from "next/server";
import { requireExtensionAuth } from "@/lib/extension-auth";
import db from "@/lib/db/legacy";

interface ExtensionResumeSummary {
  id: string;
  name: string;
  targetRole: string;
  updatedAt: string;
}

interface JoinedRow {
  id: string;
  created_at: string | null;
  job_title: string | null;
  job_company: string | null;
}

const MAX_RESUMES = 5;

export async function GET(request: NextRequest) {
  const authResult = requireExtensionAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  try {
    const rows = db
      .prepare(
        `
        SELECT
          gr.id          AS id,
          gr.created_at  AS created_at,
          j.title        AS job_title,
          j.company      AS job_company
        FROM generated_resumes gr
        LEFT JOIN jobs j ON j.id = gr.job_id AND j.user_id = gr.user_id
        WHERE gr.user_id = ?
        ORDER BY gr.created_at DESC
        LIMIT ?
        `,
      )
      .all(authResult.userId, MAX_RESUMES) as JoinedRow[];

    const resumes: ExtensionResumeSummary[] = rows.map((row) => {
      const role = row.job_title?.trim() || "Untitled resume";
      const company = row.job_company?.trim();
      const name = company ? `${role} · ${company}` : role;
      return {
        id: row.id,
        name,
        targetRole: role,
        updatedAt: row.created_at ?? "",
      };
    });

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error("Extension resumes fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load resumes" },
      { status: 500 },
    );
  }
}
