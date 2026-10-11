import type {
  ResumeDocumentModel,
  RdmProfile,
} from "@slothing/shared/resume-template";
import type { TailoredResume } from "./generator";

/**
 * Bridge: the app's live `TailoredResume` content model → the collapsed `RDM`
 * (spec §12). Lets the export / builder / tailor / opportunities paths render the
 * tailored output through the single shared `renderHtml` / `renderTypeset` engine
 * instead of the legacy V4 reusable renderer, so the V2/V3/V4 machinery can be
 * removed. Content-preserving: certifications + awards (which the RDM has no first-
 * class section for) are folded into labelled skill groups rather than dropped.
 */

/** Split a single "Start – End" dates string into RDM start/end fields. */
function splitDates(dates: string | undefined): {
  startDate?: string;
  endDate?: string;
} {
  const raw = (dates ?? "").trim();
  if (!raw) return {};
  const parts = raw
    .split(/\s*(?:–|—|-|to)\s*/i)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    const end = parts[parts.length - 1];
    return {
      startDate: parts[0],
      endDate: /present|current|now/i.test(end) ? undefined : end,
    };
  }
  return { startDate: raw };
}

export function tailoredResumeToRdm(
  resume: TailoredResume,
): ResumeDocumentModel {
  const c = resume.contact;
  const profiles: RdmProfile[] = [];
  if (c.linkedin) profiles.push({ network: "LinkedIn", url: c.linkedin });
  if (c.github) profiles.push({ network: "GitHub", url: c.github });

  const skills: ResumeDocumentModel["skills"] = [];
  if (resume.skills.length) skills.push({ keywords: resume.skills });
  if (resume.certifications?.length)
    skills.push({ name: "Certifications", keywords: resume.certifications });
  if (resume.awards?.length)
    skills.push({ name: "Awards", keywords: resume.awards });

  return {
    basics: {
      name: c.name,
      headline: c.headline,
      email: c.email,
      phone: c.phone,
      location: c.location,
      website: c.website,
      profiles: profiles.length ? profiles : undefined,
    },
    summary: resume.summary?.trim() || undefined,
    work: resume.experiences.map((e) => ({
      organization: e.company,
      position: e.title,
      ...splitDates(e.dates),
      highlights: e.highlights ?? [],
    })),
    education: resume.education.map((e) => ({
      institution: e.institution,
      area: e.field,
      studyType: e.degree,
      ...splitDates(e.date),
    })),
    skills,
    projects: resume.projects?.length
      ? resume.projects.map((p) => ({
          name: p.name,
          description: p.description,
          highlights: p.highlights ?? [],
        }))
      : undefined,
  };
}
