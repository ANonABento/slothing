import { renderHtml } from "@slothing/shared/resume-template";

import {
  getResumeTemplate,
  migrateV4ToCollapsed,
} from "@/lib/db/resume-templates";
import { getTemplateWithCustom } from "@/lib/resume/templates";
import { tailoredResumeToRdm } from "./tailored-to-rdm";
import type { TailoredResume } from "./generator";

/**
 * The SINGLE resume→HTML dispatch (spec §12). Replaces the per-route
 * if(V4-reusable) / else if(V3) / else built-in branches across export, builder,
 * tailor, and opportunities. A user-imported template now lives in the collapsed
 * `document_templates` store and renders through the shared `renderHtml`; everything
 * else falls back to a built-in template. The legacy V2/V3/V4 renderers are gone.
 */

let migratedThisProcess = false;
/** One-time, idempotent move of any committed V4 templates into the collapsed store. */
function ensureV4Migrated(): void {
  if (migratedThisProcess) return;
  migratedThisProcess = true;
  try {
    migrateV4ToCollapsed();
  } catch {
    // Best-effort: a missing legacy table or a malformed row must never block a render.
  }
}

export async function renderResumeHtmlForTemplate(
  resume: TailoredResume,
  templateId: string,
  userId: string,
): Promise<string> {
  ensureV4Migrated();
  const collapsed = getResumeTemplate(templateId, userId);
  if (collapsed) {
    return renderHtml(collapsed.template, tailoredResumeToRdm(resume)).html;
  }
  const { generateResumeHTML } = await import("@/lib/resume/pdf");
  const template = await getTemplateWithCustom(templateId, userId);
  return generateResumeHTML(resume, templateId, template);
}
