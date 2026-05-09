import { handlers, isNextAuthConfigured } from "@/auth";

export const dynamic = "force-dynamic";

// libSQL/Drizzle requires Node runtime; the auth callback writes to the DB.
export const runtime = "nodejs";

function authDisabledResponse() {
  return Response.json(
    { error: "NextAuth is disabled in local development." },
    { status: 404 },
  );
}

export const GET = isNextAuthConfigured() ? handlers.GET : authDisabledResponse;
export const POST = isNextAuthConfigured()
  ? handlers.POST
  : authDisabledResponse;
