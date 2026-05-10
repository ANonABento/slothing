import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { setCompanyGithubSlug } from "@/lib/db/company-research";
import { getJob } from "@/lib/db/jobs";
import { nowEpoch } from "@/lib/format/time";
import { getClientIdentifier, rateLimiters } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: { id: string };
}

function rateLimitResponse(request: NextRequest, userId: string) {
  const limit = rateLimiters.standard(getClientIdentifier(request, userId));
  if (limit.allowed) return null;
  return NextResponse.json(
    { error: "Too many enrichment requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(
          Math.max(1, Math.ceil((limit.resetAt - nowEpoch()) / 1000)),
        ),
      },
    },
  );
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;
  const limited = rateLimitResponse(request, authResult.userId);
  if (limited) return limited;

  const job = getJob(params.id, authResult.userId);
  if (!job) {
    return NextResponse.json(
      { error: "Opportunity not found" },
      { status: 404 },
    );
  }

  let githubSlug: string | null = null;
  try {
    const body = (await request.json()) as { githubSlug?: unknown };
    githubSlug =
      typeof body.githubSlug === "string" ? body.githubSlug.trim() : null;
  } catch {
    githubSlug = null;
  }

  const saved = setCompanyGithubSlug(
    authResult.userId,
    job.company,
    githubSlug ? githubSlug.toLowerCase() : null,
  );

  return NextResponse.json({ githubSlug: saved });
}
