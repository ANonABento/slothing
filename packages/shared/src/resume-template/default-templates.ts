import type { ResumeTemplate } from "./template";

/**
 * v1 default templates — designs ported from recognizable OSS resumes into our
 * grammar+tokens model (we reimplement the LOOK, we do NOT run their .cls / scrape
 * Overleaf). Chosen to span the whole grammar so the nearest-match classifier has
 * a good target for almost any upload. See docs/resume-template-cloning-spec.md §9.
 */
export const DEFAULT_TEMPLATES: ResumeTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    grammar: {
      columns: "single",
      header: "centered",
      sectionTitle: "full-rule",
      bullets: "disc",
      density: "normal",
    },
    tokens: {
      accent: "#222222",
      fontClass: "serif",
      baseFontSizePt: 10.5,
      lineHeight: 1.35,
    },
    meta: {
      inspiredBy: "sb2nov / moderncv-classic",
      license: "MIT / LPPL",
      description: "Safe, maximally ATS-friendly.",
    },
  },
  {
    id: "modern",
    name: "Modern",
    grammar: {
      columns: "single",
      header: "split",
      sectionTitle: "accent-bar",
      bullets: "disc",
      density: "normal",
    },
    tokens: {
      accent: "#1f4e79",
      fontClass: "sans",
      baseFontSizePt: 10.5,
      lineHeight: 1.35,
    },
    meta: {
      inspiredBy: "Awesome-CV",
      license: "LPPL-1.3c",
      description: "Clean with a touch of color.",
    },
  },
  {
    id: "sidebar",
    name: "Sidebar",
    grammar: {
      columns: "left-sidebar",
      header: "left-aligned",
      sectionTitle: "small-caps",
      bullets: "dash",
      density: "normal",
    },
    tokens: {
      accent: "#0d7377",
      fontClass: "sans",
      baseFontSizePt: 10,
      lineHeight: 1.3,
    },
    meta: {
      inspiredBy: "AltaCV",
      license: "LPPL-1.3c",
      description: "Skills/contact in a sidebar.",
    },
  },
  {
    id: "tech",
    name: "Tech",
    grammar: {
      columns: "right-sidebar",
      header: "centered",
      sectionTitle: "underline-rule",
      bullets: "arrow",
      density: "compact",
    },
    tokens: {
      accent: "#2c3e50",
      fontClass: "slab",
      baseFontSizePt: 10,
      lineHeight: 1.25,
    },
    meta: {
      inspiredBy: "Deedy-Resume",
      license: "Apache-2.0",
      description: "Tech/eng, one-page, dense.",
    },
  },
  {
    id: "compact",
    name: "Compact",
    grammar: {
      columns: "single",
      header: "left-aligned",
      sectionTitle: "small-caps",
      bullets: "dash",
      density: "compact",
    },
    tokens: {
      accent: "#444444",
      fontClass: "sans",
      baseFontSizePt: 9.5,
      lineHeight: 1.2,
    },
    meta: {
      inspiredBy: "RenderCV / original",
      description: "For lots of content.",
    },
  },
];

export function getDefaultTemplate(id: string): ResumeTemplate | undefined {
  return DEFAULT_TEMPLATES.find((t) => t.id === id);
}
