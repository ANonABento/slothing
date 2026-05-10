import { NextRequest, NextResponse } from "next/server";
import { markUnsubscribed } from "@/lib/welcome-series/state";
import { verifyUnsubscribeToken } from "@/lib/welcome-series/unsubscribe-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const userId = verifyUnsubscribeToken(token);

  if (!userId) {
    return new NextResponse(renderPage("Invalid unsubscribe link"), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  markUnsubscribed(userId);

  return new NextResponse(
    renderPage("You are unsubscribed from Slothing welcome emails."),
    {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    },
  );
}

function renderPage(message: string): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome email preferences</title>
  </head>
  <body>
    <main>
      <h1>${message}</h1>
    </main>
  </body>
</html>`;
}
