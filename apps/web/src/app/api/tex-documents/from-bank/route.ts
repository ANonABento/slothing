/**
 * @route POST /api/tex-documents/from-bank
 * @description Create a resume document from the knowledge bank.
 * @auth Required
 *
 * The cold-start path (spec §8): a user with a populated bank and no document gets one
 * without needing to write LaTeX or find a template. Deterministic — no LLM — so it works
 * with no provider configured and costs nothing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { parseJsonBody } from "@/lib/api-utils";
import { isAuthError, requireAuth } from "@/lib/auth";
import { createTexDocument } from "@/lib/db/tex-documents";
import { getGroupedBankEntries } from "@/lib/db/profile-bank";
import { nowEpoch } from "@/lib/format/time";
import { tailoredResumeToTex } from "@/lib/latex/from-tailored";
import { bankEntriesToResume } from "@/lib/resume/bank-to-resume";
import { settingsSchema } from "@/lib/latex/settings";
import { getClientIdentifier, rateLimiters } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  kind: z.enum(["resume", "cv"]).default("resume"),
  /** The caller's Studio defaults — font, size, margin — applied at creation. */
  settings: settingsSchema.partial().optional(),
});

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
          "Retry-After": Math.max(
            1,
            Math.ceil((limit.resetAt - nowEpoch()) / 1000),
          ).toString(),
        },
      },
    );
  }

  const parsed = await parseJsonBody(request, bodySchema);
  if (!parsed.ok) return parsed.response;

  const grouped = await getGroupedBankEntries(auth.userId);
  const entries = Object.values(grouped).flatMap((group) =>
    Array.isArray(group) ? group : [],
  );

  if (entries.length === 0) {
    return NextResponse.json(
      {
        error:
          "Your knowledge bank is empty. Upload a resume first so there is something to build from.",
        code: "empty_bank",
      },
      { status: 400 },
    );
  }

  const source = tailoredResumeToTex(
    bankEntriesToResume(entries),
    parsed.data.settings,
  );

  const document = await createTexDocument({
    userId: auth.userId,
    kind: parsed.data.kind,
    title: parsed.data.title?.trim() || "Resume",
    source,
  });

  return NextResponse.json({ document }, { status: 201 });
}
