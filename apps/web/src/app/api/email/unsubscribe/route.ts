import { NextRequest, NextResponse } from "next/server";
import { setDigestEnabled } from "@/lib/settings/digest";
import { verifyDigestUnsubscribeToken } from "@/lib/digest/unsubscribe-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const topic = searchParams.get("topic");

  if (!token || topic !== "daily-digest") {
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
