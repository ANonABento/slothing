import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/db/jobs";
import {
  getCompanyEnrichment,
  isEnrichmentStale,
} from "@/lib/db/company-research";
import { enrichCompany } from "@/lib/enrichment";
import { nowEpoch } from "@/lib/format/time";
import { requireAuth, isAuthError } from "@/lib/auth";
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

export async function GET(request: NextRequest, { params }: RouteContext) {
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

  const cached = getCompanyEnrichment(job.company, authResult.userId);
  return NextResponse.json(cached ?? { snapshot: null, enrichedAt: null });
}

export async function POST(request: NextRequest, { params }: RouteContext) {
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

  const forceRefresh = request.nextUrl.searchParams.get("refresh") === "true";
  const cached = getCompanyEnrichment(job.company, authResult.userId);
  if (cached && !forceRefresh && !isEnrichmentStale(cached.enrichedAt)) {
    return NextResponse.json({ ...cached, fromCache: true });
  }

  let githubOrg: string | null = null;
  try {
    const body = await request.json();
    githubOrg = typeof body.githubOrg === "string" ? body.githubOrg : null;
  } catch {
    githubOrg = null;
  }

  const snapshot = await enrichCompany({
    companyName: job.company,
    companyUrl: job.url,
    githubOrg,
    userId: authResult.userId,
  });

  return NextResponse.json({
    snapshot,
    enrichedAt: snapshot.enrichedAt,
    fromCache: false,
  });
}
