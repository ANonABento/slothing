/**
 * @route GET /api/extension/opportunities
 * @description List the authenticated user's opportunities for non-browser MCP clients.
 * @auth Extension token
 * @query status?: comma-separated status filter (pending, applied, interviewing, ...)
 * @query limit?: max number of results (default 50, capped at 200)
 * @response { opportunities: JobDescription[] }
 *
 * This is the read-side companion to POST /api/opportunities/from-extension. It
 * reuses the same extension-token auth helper the Columbus browser extension
 * uses, so the @slothing/mcp server (and any other agent runtime holding an
 * extension token) can list opportunities without going through NextAuth.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireExtensionAuth } from "@/lib/extension-auth";
import { getJobs } from "@/lib/db/queries/jobs";

const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 50;

export async function GET(request: NextRequest) {
  const authResult = requireExtensionAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  try {
    const url = new URL(request.url);
    const statusParam = url.searchParams.get("status");
    const limitParam = url.searchParams.get("limit");

    const statuses = statusParam
      ? statusParam
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : null;

    const limit = limitParam
      ? Math.min(MAX_LIMIT, Math.max(1, Number(limitParam) || DEFAULT_LIMIT))
      : DEFAULT_LIMIT;

    const all = await getJobs(authResult.userId);
    const filtered = statuses
      ? all.filter((j) => (j.status ? statuses.includes(j.status) : false))
      : all;
    const opportunities = filtered.slice(0, limit);

    return NextResponse.json({
      opportunities,
      total: filtered.length,
    });
  } catch (error) {
    console.error("Extension opportunities list error:", error);
    return NextResponse.json(
      { error: "Failed to list opportunities" },
      { status: 500 },
    );
  }
}
