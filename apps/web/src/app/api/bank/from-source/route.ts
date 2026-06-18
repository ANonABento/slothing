import { NextRequest, NextResponse } from "next/server";

import { requireAuth, isAuthError } from "@/lib/auth";
import { parseJsonBody } from "@/lib/api-utils";
import { rateLimiters, getClientIdentifier } from "@/lib/rate-limit";
import { nowEpoch } from "@/lib/format/time";
import { fromSourceBankSchema } from "@/lib/schemas/bank";
import { insertBankEntry, type InsertBankEntry } from "@/lib/db/profile-bank";
import type { BankEntryGrounding } from "@/types";

export const dynamic = "force-dynamic";

function normalizeLabel(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * @route POST /api/bank/from-source
 * @description Commit a reviewed project draft (from /api/bank/ai/research) to the bank: one
 *   `project` parent plus its `bullet` children in the canonical nested shape (parent_id +
 *   component_type/order), all `verified` since the user reviewed them. Grounded in the source URL.
 * @auth Required
 */
export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const limit = rateLimiters.standard(
    getClientIdentifier(request, auth.userId),
  );
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again shortly.",
        code: "rate_limited",
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(
            (limit.resetAt - nowEpoch()) / 1000,
          ).toString(),
        },
      },
    );
  }

  const parsed = await parseJsonBody(request, fromSourceBankSchema);
  if (!parsed.ok) return parsed.response;
  const { url, name, technologies, bullets } = parsed.data;

  const grounding: BankEntryGrounding | undefined = url
    ? { kind: "url", url }
    : undefined;

  try {
    const projectId = insertBankEntry(
      {
        category: "project",
        content: {
          name,
          technologies,
          ...(url ? { url } : {}),
          childCount: bullets.length,
        },
        status: "verified",
        authoredBy: "ai_articulated",
        ...(grounding ? { groundedIn: grounding } : {}),
        confidenceScore: 1,
      },
      auth.userId,
    );

    const parentKey = normalizeLabel(name);
    const bulletIds = bullets.map((description, order) => {
      const child: InsertBankEntry = {
        category: "bullet",
        content: {
          description,
          text: description,
          context: name,
          parentType: "project",
          parentId: projectId,
          parentKey,
          parentLabel: name,
          order,
          sourceSection: "project",
          project: name,
          technologies,
        },
        parentId: projectId,
        componentType: "project",
        componentOrder: order,
        sourceSection: "project",
        status: "verified",
        authoredBy: "ai_articulated",
        ...(grounding ? { groundedIn: grounding } : {}),
        confidenceScore: 1,
      };
      return insertBankEntry(child, auth.userId);
    });

    return NextResponse.json(
      { success: true, projectId, bulletIds, name },
      { status: 201 },
    );
  } catch (error) {
    console.error("Commit from-source error:", error);
    return NextResponse.json(
      {
        error: "Failed to add the project to your bank.",
        code: "commit_failed",
      },
      { status: 500 },
    );
  }
}
