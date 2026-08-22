/**
 * @route POST /api/tex-documents/starter
 * @description Create a blank starter document of any kind, pre-filled with the user's
 *   own contact details.
 * @auth Required
 *
 * Deterministic — no LLM, no bank — so it works on a brand-new account with nothing in it.
 * That is the whole point: `from-bank` refuses an empty bank and the cover-letter route
 * needs both a job description and a provider key, which left a new user with no way to
 * create anything at all.
 */
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { parseJsonBody } from "@/lib/api-utils";
import { isAuthError, requireAuth } from "@/lib/auth";
import { createTexDocument } from "@/lib/db/tex-documents";
import { getProfile } from "@/lib/db";
import { nowEpoch } from "@/lib/format/time";
import {
  generateCoverLetterTex,
  generateResumeTex,
} from "@/lib/latex/generate";
import { settingsSchema } from "@/lib/latex/settings";
import {
  STARTER_PARAGRAPHS,
  STARTER_SECTIONS,
  starterTitle,
} from "@/lib/latex/starter";
import { getClientIdentifier, rateLimiters } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  kind: z.enum(["resume", "cv", "cover_letter"]).default("resume"),
  title: z.string().min(1).max(200).optional(),
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
  const { kind, settings } = parsed.data;

  // A profile is optional. Placeholders are better than refusing to create anything —
  // the name is one click away in the inspector once the document exists.
  const profile = getProfile(auth.userId);
  const name = profile?.contact?.name?.trim() || "Your Name";
  const contact =
    [
      profile?.contact?.email,
      profile?.contact?.phone,
      profile?.contact?.location,
    ]
      .map((part) => (typeof part === "string" ? part.trim() : ""))
      .filter(Boolean)
      .join(" · ") || "you@example.com";

  const source =
    kind === "cover_letter"
      ? generateCoverLetterTex({
          name,
          contact,
          paragraphs: STARTER_PARAGRAPHS,
          settings,
        })
      : generateResumeTex({
          name,
          contact,
          sections: STARTER_SECTIONS,
          settings,
        });

  const document = await createTexDocument({
    userId: auth.userId,
    kind,
    title: parsed.data.title?.trim() || starterTitle(kind),
    source,
  });

  return NextResponse.json({ document }, { status: 201 });
}
