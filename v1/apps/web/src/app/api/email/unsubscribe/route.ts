import { NextRequest, NextResponse } from "next/server";
import { verifyDigestUnsubscribeToken } from "@/lib/digest/unsubscribe-token";
import { setDigestEnabled } from "@/lib/settings/digest";
import { markUnsubscribed } from "@/lib/welcome-series/state";
import { verifyUnsubscribeToken } from "@/lib/welcome-series/unsubscribe-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";
  const topic = searchParams.get("topic");

  if (topic === "daily-digest") {
    if (!token) {
      return NextResponse.json(
        { error: "Invalid unsubscribe link" },
        { status: 400 },
      );
    }

    const verification = verifyDigestUnsubscribeToken(token);
    if (!verification.valid) {
      return NextResponse.json(
        { error: "Invalid unsubscribe link" },
        { status: 400 },
      );
    }

    setDigestEnabled(false, verification.userId);

    return new NextResponse(
      `<!doctype html>
<html>
  <body>
    <main>
      <h1>You've been unsubscribed from daily job digests.</h1>
      <p>You can turn them back on from settings.</p>
      <p><a href="/settings">Open settings</a></p>
    </main>
  </body>
</html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  }

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
