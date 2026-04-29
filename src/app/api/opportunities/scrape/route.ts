/**
 * @route POST /api/opportunities/scrape
 * @description Scrape a supported job-board URL and return a structured opportunity preview
 * @auth Required
 * @request { url: string }
 * @response { opportunity: ScrapedOpportunity }
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getClientIdentifier, rateLimiters } from "@/lib/rate-limit";
import {
  OpportunityScrapeError,
  scrapeOpportunityFromUrl,
} from "@/lib/opportunities/scrape";

interface ScrapeRequest {
  url?: unknown;
}

function errorResponse(error: OpportunityScrapeError) {
  return NextResponse.json(
    { error: error.message, code: error.code },
    { status: error.status }
  );
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const rateLimit = rateLimiters.standard(
    getClientIdentifier(request, authResult.userId)
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many scrape requests. Please try again later.",
        code: "rate_limited",
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000)).toString(),
        },
      }
    );
  }

  try {
    let body: ScrapeRequest;
    try {
      body = (await request.json()) as ScrapeRequest;
    } catch {
      return errorResponse(
        new OpportunityScrapeError(
          "invalid_url",
          "A valid JSON body with a URL is required."
        )
      );
    }

    if (typeof body.url !== "string" || !body.url.trim()) {
      return errorResponse(
        new OpportunityScrapeError("invalid_url", "A URL is required.")
      );
    }

    const opportunity = await scrapeOpportunityFromUrl(body.url.trim());
    return NextResponse.json({ opportunity });
  } catch (error) {
    if (error instanceof OpportunityScrapeError) {
      return errorResponse(error);
    }

    console.error("Opportunity scrape error:", error);
    return NextResponse.json(
      { error: "Failed to scrape opportunity.", code: "scrape_failed" },
      { status: 500 }
    );
  }
}
