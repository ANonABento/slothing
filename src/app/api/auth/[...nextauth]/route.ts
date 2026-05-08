import { handlers } from "@/auth";

// libSQL/Drizzle requires Node runtime; the auth callback writes to the DB.
export const runtime = "nodejs";

export const { GET, POST } = handlers;
