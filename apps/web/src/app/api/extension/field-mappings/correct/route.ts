/**
 * @route POST /api/extension/field-mappings/correct
 * @description Persist a user correction so the per-domain field mapping
 *   grows stronger over time. Implements the server side of the corrections
 *   feedback loop (task #33 in docs/extension-roadmap-2026-05.md).
 * @auth Extension token (X-Extension-Token header)
 * @request {
 *   domain: string,
 *   fieldSignature: string,
 *   fieldType: string,
 *   originalSuggestion: string,
 *   userValue: string,
 *   confidence?: number
 * }
 * @response { saved: true, hitCount: number }
 */

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireExtensionAuth } from "@/lib/extension-auth";
import db from "@/lib/db/legacy";
import { ensureFieldMappingsCorrectionColumns } from "@/lib/db/field-mappings-schema";
import { nowIso } from "@/lib/format/time";

interface CorrectionBody {
  domain?: unknown;
  fieldSignature?: unknown;
  fieldType?: unknown;
  originalSuggestion?: unknown;
  userValue?: unknown;
  confidence?: unknown;
}

/**
 * Normalize a domain so e.g. "Greenhouse.IO" and "greenhouse.io" share a
 * mapping. Strips the optional leading "www." too.
 */
function normalizeDomain(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: NextRequest) {
  const authResult = requireExtensionAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  let body: CorrectionBody;
  try {
    body = (await request.json()) as CorrectionBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    !isNonEmptyString(body.domain) ||
    !isNonEmptyString(body.fieldSignature) ||
    !isNonEmptyString(body.fieldType) ||
    typeof body.userValue !== "string" ||
    typeof body.originalSuggestion !== "string"
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  // Defensive: never store huge blobs even if a misbehaving client sends one.
  const userValue = body.userValue.slice(0, 2000);
  const domain = normalizeDomain(body.domain).slice(0, 200);
  const fieldSignature = body.fieldSignature.slice(0, 500);
  const fieldType = body.fieldType.slice(0, 80);

  try {
    ensureFieldMappingsCorrectionColumns(db);

    const userId = authResult.userId;
    const now = nowIso();

    const existing = db
      .prepare(
        `SELECT id, hit_count FROM field_mappings
         WHERE user_id = ? AND domain = ? AND field_signature = ?
         LIMIT 1`,
      )
      .get(userId, domain, fieldSignature) as
      | { id: string; hit_count: number | null }
      | undefined;

    if (existing) {
      const nextHitCount = (existing.hit_count ?? 0) + 1;
      db.prepare(
        `UPDATE field_mappings
         SET observed_value = ?,
             field_type = ?,
             hit_count = ?,
             last_seen_at = ?
         WHERE id = ? AND user_id = ?`,
      ).run(userValue, fieldType, nextHitCount, now, existing.id, userId);

      return NextResponse.json({ saved: true, hitCount: nextHitCount });
    }

    const id = randomUUID();
    // `site_pattern` and `field_selector` are NOT NULL legacy columns. We
    // populate them with the domain/signature so legacy queries that read
    // those columns still see something sensible.
    db.prepare(
      `INSERT INTO field_mappings
        (id, user_id, site_pattern, field_selector, field_type, custom_value,
         enabled, domain, field_signature, observed_value, hit_count,
         last_seen_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?, 1, ?, ?)`,
    ).run(
      id,
      userId,
      domain,
      fieldSignature,
      fieldType,
      userValue,
      domain,
      fieldSignature,
      userValue,
      now,
      now,
    );

    return NextResponse.json({ saved: true, hitCount: 1 });
  } catch (error) {
    console.error("Save correction error:", error);
    return NextResponse.json(
      { error: "Failed to save correction" },
      { status: 500 },
    );
  }
}
