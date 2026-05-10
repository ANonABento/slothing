import type { NextRequest } from "next/server";
import { isNextAuthConfigured } from "@/auth.config";

export const dynamic = "force-dynamic";

// libSQL/Drizzle requires Node runtime; the auth callback writes to the DB.
export const runtime = "nodejs";

function authDisabledResponse() {
  return Response.json(
    { error: "NextAuth is disabled in local development." },
    { status: 404 },
  );
}

async function handleAuth(method: "GET" | "POST", request: NextRequest) {
  if (!isNextAuthConfigured()) {
    return authDisabledResponse();
  }

  const { handlers } = await import("@/auth");
  return handlers[method](request);
}

export function GET(request: NextRequest) {
  return handleAuth("GET", request);
}

export function POST(request: NextRequest) {
  return handleAuth("POST", request);
}
