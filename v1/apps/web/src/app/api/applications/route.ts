import { NextRequest, NextResponse } from "next/server";

const APPLICATION_STATUSES = "applied,interviewing,offered";

export function GET(request: NextRequest) {
  return redirectToOpportunities(request);
}

export function POST(request: NextRequest) {
  return redirectToOpportunities(request);
}

function redirectToOpportunities(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/api/opportunities";
  if (!url.searchParams.has("status")) {
    url.searchParams.set("status", APPLICATION_STATUSES);
  }

  return NextResponse.redirect(url, 307);
}
