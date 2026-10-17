import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import * as ext from "@/lib/extension";

export const runtime = "nodejs";

/** POST /api/extension/<op> with the extension's key in `x-slothing-key`. Answers { ok, data } or { ok: false, error }. */
const OPS: Record<string, (body: unknown) => unknown> = {
  status: ext.status,
  job: async (b) => {
    const r = await ext.saveJob(b);
    if (r.created) revalidatePath("/");
    return r;
  },
  fill: (b) => {
    const r = ext.fill(b);
    revalidatePath("/answers");
    return r;
  },
  seen: async (b) => {
    const r = await ext.seen(b);
    if (r.job) revalidatePath("/");
    return r;
  },
  tailor: async (b) => {
    const r = await ext.tailor(b);
    revalidatePath(`/jobs/${r.job.id}`);
    return r;
  },
  applied: (b) => {
    const r = ext.applied(b);
    revalidatePath("/");
    revalidatePath(`/jobs/${r.job.id}`);
    return r;
  },
  draft: ext.draft,
  propose: ext.propose,
  answers: (b) => {
    const r = ext.saveAnswers(b);
    revalidatePath("/answers");
    return r;
  },
};

export async function POST(req: NextRequest, { params }: { params: Promise<{ op: string }> }) {
  const handler = OPS[(await params).op];
  if (!handler) return NextResponse.json({ ok: false, error: "Unknown operation." }, { status: 404 });
  if (!ext.keyMatches(req.headers.get("x-slothing-key"))) {
    return NextResponse.json({ ok: false, error: "The extension's key doesn't match. Connect it again from Slothing's Extension page." }, { status: 401 });
  }
  ext.markSeen(req.headers.get("x-slothing-version") ?? "");
  try {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({ ok: true, data: await handler(body) });
  } catch (e) {
    const error = e instanceof z.ZodError ? "The extension sent something unexpected. Update it (npm run extension) and try again." : e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: error.slice(0, 400) }, { status: e instanceof z.ZodError ? 400 : 500 });
  }
}
