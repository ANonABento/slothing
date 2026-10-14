import { NextResponse, type NextRequest } from "next/server";

import { getDoc, getJob, getProfile } from "@/lib/db";
import { ENGINES, renderPdf, renderSource, type Engine, type RenderInput } from "@/lib/render";
import { profileAsTailored, resolveLetter, resolveResume } from "@/lib/resolve";

export const runtime = "nodejs";

/**
 * GET /api/pdf?engine=html|typst|latex&kind=resume|letter[&job=ID][&download=1][&source=1]
 * Without `job`, renders the untailored profile as a resume.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const engine = (q.get("engine") ?? "typst") as Engine;
  if (!ENGINES.includes(engine)) return NextResponse.json({ error: "unknown engine" }, { status: 400 });

  const profile = getProfile();
  const jobId = q.get("job");
  const kind = q.get("kind") === "letter" ? "letter" : "resume";
  let input: RenderInput;
  let filename = `${profile.contact.name || "resume"}`.replace(/\s+/g, "_");

  if (!jobId) {
    input = { kind: "resume", data: resolveResume(profile, profileAsTailored(profile)) };
  } else {
    const job = getJob(jobId);
    if (!job) return NextResponse.json({ error: "job not found" }, { status: 404 });
    filename += `_${job.company || "job"}`.replace(/\s+/g, "_");
    if (kind === "resume") {
      const doc = getDoc(jobId, "resume");
      if (!doc) return NextResponse.json({ error: "no resume yet" }, { status: 404 });
      input = { kind, data: resolveResume(profile, doc.data) };
    } else {
      const doc = getDoc(jobId, "cover_letter");
      if (!doc) return NextResponse.json({ error: "no cover letter yet" }, { status: 404 });
      input = { kind, data: resolveLetter(profile, job, doc.data) };
      filename += "_cover_letter";
    }
  }

  if (q.get("source")) {
    return new NextResponse(renderSource(engine, input), { headers: { "content-type": "text/plain; charset=utf-8" } });
  }

  // ASCII fallback plus RFC 5987 UTF-8 name, so "山田" or "Société" don't break the header.
  const ascii = filename.normalize("NFKD").replace(/[^\w.-]+/g, "_").replace(/_+/g, "_") || "document";
  const disposition = `${q.get("download") ? "attachment" : "inline"}; filename="${ascii}.pdf"; filename*=UTF-8''${encodeURIComponent(`${filename}.pdf`)}`;

  let pdf: Buffer;
  try {
    pdf = await renderPdf(engine, input);
  } catch (e) {
    return new NextResponse(`Render failed (${engine}):\n\n${(e as Error).message}`, { status: 500, headers: { "content-type": "text/plain" } });
  }
  return new NextResponse(new Uint8Array(pdf), {
    headers: { "content-type": "application/pdf", "content-disposition": disposition, "cache-control": "no-store" },
  });
}
