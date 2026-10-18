import { createMcpHandler, localhostAllowedOrigins, originValidationResponse } from "@modelcontextprotocol/server";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { keyMatches } from "@/lib/extension";
import { buildServer } from "@/lib/mcp";

export const runtime = "nodejs";

const handler = createMcpHandler(() => buildServer());

/**
 * MCP over HTTP for agents: `Authorization: Bearer <key>` with the key from the Extension page. A browser
 * page from another site is refused by its Origin (CLI agents send none); the key stops everything else.
 */
async function handle(req: NextRequest) {
  const key = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null;
  if (!keyMatches(key)) return NextResponse.json({ error: "Missing or wrong key. Copy it from Slothing's Extension page." }, { status: 401 });
  const rejected = originValidationResponse(req, localhostAllowedOrigins());
  if (rejected) return rejected;
  const res = await handler.fetch(req);
  // Tools change jobs and documents: the app's pages show the change on their next load.
  if (req.method === "POST") revalidatePath("/", "layout");
  return res;
}

export { handle as GET, handle as POST, handle as DELETE };
