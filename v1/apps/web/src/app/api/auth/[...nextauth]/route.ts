import type { NextRequest } from "next/server";
import { getMissingAuthEnv, isNextAuthConfigured } from "@/auth.config";

export const dynamic = "force-dynamic";

// libSQL/Drizzle requires Node runtime; the auth callback writes to the DB.
export const runtime = "nodejs";

function authDisabledResponse() {
  return Response.json(
    {
      error: "auth_disabled",
      message: "Authentication is not configured on this instance.",
      missing: getMissingAuthEnv(),
      docs: "https://slothing.dev/docs/self-hosting#auth",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
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
