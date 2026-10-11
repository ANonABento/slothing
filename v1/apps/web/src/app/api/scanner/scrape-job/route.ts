import { NextRequest, NextResponse } from "next/server";
import { getClientIdentifier, rateLimiters } from "@/lib/rate-limit";
import {
  OpportunityScrapeError,
  scrapeOpportunityFromUrl,
} from "@/lib/opportunities/scrape";
import { nowEpoch } from "@/lib/format/time";

export const dynamic = "force-dynamic";

interface ScrapeRequest {
  url?: unknown;
}

function errorResponse(error: OpportunityScrapeError) {
  return NextResponse.json(
    { error: error.message, code: error.code },
    { status: error.status },
  );
}

function rateLimitResponse(request: NextRequest) {
  const rateLimit = rateLimiters.standard(getClientIdentifier(request));
  if (rateLimit.allowed) return null;
  return NextResponse.json(
    {
      error: "Too many scrape requests. Please try again later.",
      code: "rate_limited",
    },
    {
      status: 429,
      headers: {
        "Retry-After": Math.max(
          1,
          Math.ceil((rateLimit.resetAt - nowEpoch()) / 1000),
        ).toString(),
      },
    },
  );
}

function safeHost(rawUrl: string) {
  try {
    return new URL(rawUrl).hostname;
  } catch {
    return "invalid-url";
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimitResponse(request);
  if (limited) return limited;
  let requestedUrl = "";

  try {
    let body: ScrapeRequest;
    try {
      body = (await request.json()) as ScrapeRequest;
    } catch {
      return errorResponse(
        new OpportunityScrapeError(
          "invalid_url",
          "A valid JSON body with a URL is required.",
        ),
      );
    }

    if (typeof body.url !== "string" || !body.url.trim()) {
      return errorResponse(
        new OpportunityScrapeError("invalid_url", "A URL is required."),
      );
    }

    requestedUrl = body.url.trim();
    const opportunity = await scrapeOpportunityFromUrl(requestedUrl);
    return NextResponse.json({ opportunity });
  } catch (error) {
    if (error instanceof OpportunityScrapeError) {
      console.warn("[scanner/scrape-job] scrape failed", {
        code: error.code,
        host: safeHost(requestedUrl),
      });
      return errorResponse(error);
    }

    console.error(
      "[scanner/scrape-job] failed",
      error instanceof Error ? error.name : "UnknownError",
    );
    return NextResponse.json(
      { error: "Failed to scrape the job posting.", code: "scrape_failed" },
      { status: 500 },
    );
  }
}
