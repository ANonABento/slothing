import { NextResponse, type NextRequest } from "next/server";

import { getDoc, getJob, getProfile, getSettings, getVersion } from "@/lib/db";
import { renderPdf, renderSource, type RenderInput } from "@/lib/render";
import { profileAsTailored, resolveLetter, resolveResume } from "@/lib/resolve";
import { Settings } from "@/lib/types";

export const runtime = "nodejs";

/**
 * GET /api/pdf?kind=resume|letter[&job=ID][&ver=ID][&download=1][&source=1][&layout=JSON]
 * `ver` renders a saved version of the job's document instead of the current one.
 * Without `job`, renders the untailored profile as a resume. `layout` previews unsaved resume
 * settings (Settings → Resume design); without it, the saved ones are used.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const profile = getProfile();
  let layout = getSettings().resume;
  const draft = q.get("layout");
  if (draft) {
    let parsed;
    try {
      parsed = Settings.shape.resume.safeParse(JSON.parse(draft));
    } catch {}
    if (!parsed?.success) return NextResponse.json({ error: "bad layout" }, { status: 400 });
    layout = parsed.data;
  }
  const jobId = q.get("job");
  const kind = q.get("kind") === "letter" ? "letter" : "resume";
  let input: RenderInput;
  let filename = `${profile.contact.name || "resume"}`.replace(/\s+/g, "_");

  if (!jobId) {
    input = { kind: "resume", data: resolveResume(profile, profileAsTailored(profile), layout) };
  } else {
    const job = getJob(jobId);
    if (!job) return NextResponse.json({ error: "job not found" }, { status: 404 });
    filename += `_${job.company || "job"}`.replace(/\s+/g, "_");
    if (kind === "resume") {
      const ver = q.get("ver");
      const doc = ver ? getVersion(jobId, "resume", ver) : getDoc(jobId, "resume");
      if (!doc) return NextResponse.json({ error: "no resume yet" }, { status: 404 });
      input = { kind, data: resolveResume(profile, doc.data, layout) };
    } else {
      const ver = q.get("ver");
      const doc = ver ? getVersion(jobId, "cover_letter", ver) : getDoc(jobId, "cover_letter");
      if (!doc) return NextResponse.json({ error: "no cover letter yet" }, { status: 404 });
      input = { kind, data: resolveLetter(profile, job, doc.data, layout) };
      filename += "_cover_letter";
    }
  }

  if (q.get("source")) {
    return new NextResponse(renderSource(input), { headers: { "content-type": "text/plain; charset=utf-8" } });
  }

  // ASCII fallback plus RFC 5987 UTF-8 name, so "山田" or "Société" don't break the header.
  const ascii = filename.normalize("NFKD").replace(/[^\w.-]+/g, "_").replace(/_+/g, "_") || "document";
  const disposition = `${q.get("download") ? "attachment" : "inline"}; filename="${ascii}.pdf"; filename*=UTF-8''${encodeURIComponent(`${filename}.pdf`)}`;

  let pdf: Buffer;
  try {
    pdf = await renderPdf(input);
  } catch (e) {
    return new NextResponse(`Render failed:\n\n${(e as Error).message}`, { status: 500, headers: { "content-type": "text/plain" } });
  }
  return new NextResponse(new Uint8Array(pdf), {
    headers: { "content-type": "application/pdf", "content-disposition": disposition, "cache-control": "no-store" },
  });
}
