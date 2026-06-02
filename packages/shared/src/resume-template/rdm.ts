import { z } from "zod";

/**
 * Resume Document Model (RDM) — the SINGLE SOURCE OF TRUTH for resume content.
 * Templates are pure functions of (RDM, ResumeTemplate). The RDM is content only;
 * it carries NO presentation. Vocabulary is aligned with the JSON Resume schema
 * (MIT) for interop. See docs/resume-template-cloning-spec.md §2.
 */

export interface RdmProfile {
  network: string; // "LinkedIn", "GitHub", ...
  url: string;
}

export interface RdmBasics {
  name: string;
  headline?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  profiles?: RdmProfile[];
}

export interface RdmWork {
  organization: string;
  position: string;
  location?: string;
  /** ISO-ish date strings; presentation-layer formats them. */
  startDate?: string;
  /** Undefined => "Present". */
  endDate?: string;
  highlights: string[];
}

export interface RdmEducation {
  institution: string;
  area: string;
  studyType?: string; // "B.S.", "M.Sc.", ...
  startDate?: string;
  endDate?: string;
  score?: string; // GPA etc.
  highlights?: string[];
}

export interface RdmSkillGroup {
  /** Optional group label, e.g. "Languages". */
  name?: string;
  keywords: string[];
}

export interface RdmProject {
  name: string;
  description?: string;
  url?: string;
  highlights: string[];
}

export interface ResumeDocumentModel {
  basics: RdmBasics;
  summary?: string;
  work: RdmWork[];
  education: RdmEducation[];
  skills: RdmSkillGroup[];
  projects?: RdmProject[];
}

const profileSchema = z.object({ network: z.string(), url: z.string() });

export const resumeDocumentModelSchema = z.object({
  basics: z.object({
    name: z.string().min(1),
    headline: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.string().optional(),
    profiles: z.array(profileSchema).optional(),
  }),
  summary: z.string().optional(),
  work: z.array(
    z.object({
      organization: z.string(),
      position: z.string(),
      location: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      highlights: z.array(z.string()),
    }),
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      area: z.string(),
      studyType: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      score: z.string().optional(),
      highlights: z.array(z.string()).optional(),
    }),
  ),
  skills: z.array(
    z.object({
      name: z.string().optional(),
      keywords: z.array(z.string()),
    }),
  ),
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        url: z.string().optional(),
        highlights: z.array(z.string()),
      }),
    )
    .optional(),
});
