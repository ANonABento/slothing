// Hidden-text and prompt-injection detector.
//
// Catches resume "hacks" that have spread on TikTok and LinkedIn since 2023:
// - White-on-white keyword stuffing (color-matched text)
// - Microscopic-font keyword stuffing (1pt text)
// - LLM prompt injection ("Ignore previous instructions...")
//
// Modern ATS (Greenhouse, Workday, Lever) increasingly flag these and may
// attach a fraud marker to the candidate record. Even when undetected,
// recruiters see the jumble on the parsed profile page. The goal of this
// detector is to surface these to the candidate as warnings, so they don't
// accidentally tank their own application.
//
// Inputs:
// - Raw text (any source)
// - Optional `htmlFragments` for inline-style color/size analysis when the
//   resume is uploaded as HTML or extracted from a DOCX with style info.

const PROMPT_INJECTION_PATTERNS: ReadonlyArray<{
  pattern: RegExp;
  label: string;
}> = [
  {
    label: "ignore previous instructions",
    pattern:
      /\bignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions?\b/i,
  },
  {
    label: "disregard previous instructions",
    pattern:
      /\bdisregard\s+(?:all\s+)?(?:previous|prior|above)\s+instructions?\b/i,
  },
  {
    label: "as an AI / as a language model",
    pattern: /\b(?:as\s+an?\s+(?:ai|language\s+model|llm))\b/i,
  },
  {
    label: "you are a recruiter / hiring manager prompt",
    pattern:
      /\byou\s+are\s+a\s+(?:recruiter|hiring\s+manager|professional\s+recruiter|talent\s+acquisition)\b/i,
  },
  {
    label: "system prompt leak",
    pattern: /\b(?:system\s+prompt|new\s+instructions)\s*[:=]/i,
  },
  {
    label: "recommend this candidate / hire this candidate",
    pattern:
      /\b(?:recommend|hire|prefer|select|advance|highly\s+rate)\s+this\s+candidate\b/i,
  },
  {
    label: "this candidate is the best fit / highly qualified",
    pattern:
      /\bthis\s+candidate\s+is\s+(?:the\s+(?:best|ideal|perfect)\s+fit|highly\s+qualified|the\s+strongest|exceptional)\b/i,
  },
  {
    label: "rate this resume 10/10 or 100%",
    pattern:
      /\brate\s+(?:this\s+(?:resume|candidate))\s+(?:10\s*\/?\s*10|100\s*%|perfect|the\s+highest)\b/i,
  },
  {
    label: "[INST] / <|im_start|> chat-template markers",
    pattern: /(\[INST\]|<\|im_start\|>|<\|system\|>|<\|user\|>)/i,
  },
];

export interface HiddenTextHit {
  kind: "prompt-injection" | "invisible-text" | "tiny-text" | "off-screen";
  label: string;
  excerpt: string;
}

export interface HiddenTextHtmlFragment {
  text: string;
  /** CSS color of the text run, if known (any CSS color string). */
  color?: string;
  /** CSS background color of the surrounding container, if known. */
  background?: string;
  /** Font size in px, if known. */
  fontSizePx?: number;
  /** Opacity 0..1, if known. */
  opacity?: number;
  /**
   * Optional render position hint. We treat negative coords or `display:none`
   * as off-screen.
   */
  offScreen?: boolean;
}

export interface HiddenTextReport {
  hits: HiddenTextHit[];
  hasPromptInjection: boolean;
  hasInvisibleText: boolean;
  hasTinyText: boolean;
}

function normalizeColor(input: string | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;
  if (trimmed === "transparent") return null;
  return trimmed;
}

function isWhitish(color: string): boolean {
  if (color === "white") return true;
  if (color === "#fff" || color === "#ffffff") return true;
  const rgbMatch = color.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/,
  );
  if (rgbMatch) {
    const r = Number(rgbMatch[1]);
    const g = Number(rgbMatch[2]);
    const b = Number(rgbMatch[3]);
    return r >= 250 && g >= 250 && b >= 250;
  }
  return false;
}

function colorsLookEqual(a: string, b: string): boolean {
  return a === b || (isWhitish(a) && isWhitish(b));
}

export function detectHiddenText(
  text: string,
  htmlFragments: ReadonlyArray<HiddenTextHtmlFragment> = [],
): HiddenTextReport {
  const hits: HiddenTextHit[] = [];

  for (const probe of PROMPT_INJECTION_PATTERNS) {
    const match = text.match(probe.pattern);
    if (match) {
      const idx = text.search(probe.pattern);
      const start = Math.max(0, idx - 30);
      const end = Math.min(text.length, idx + match[0].length + 30);
      hits.push({
        kind: "prompt-injection",
        label: probe.label,
        excerpt: text.slice(start, end).trim(),
      });
    }
  }

  for (const fragment of htmlFragments) {
    const trimmed = fragment.text.trim();
    if (!trimmed) continue;

    if (typeof fragment.opacity === "number" && fragment.opacity <= 0.05) {
      hits.push({
        kind: "invisible-text",
        label: "near-zero opacity",
        excerpt: trimmed.slice(0, 120),
      });
      continue;
    }

    const color = normalizeColor(fragment.color);
    const background = normalizeColor(fragment.background) ?? "white";
    if (color && colorsLookEqual(color, background)) {
      hits.push({
        kind: "invisible-text",
        label: "text color matches background",
        excerpt: trimmed.slice(0, 120),
      });
      continue;
    }

    if (
      typeof fragment.fontSizePx === "number" &&
      fragment.fontSizePx > 0 &&
      fragment.fontSizePx < 3
    ) {
      hits.push({
        kind: "tiny-text",
        label: `font size ${fragment.fontSizePx}px`,
        excerpt: trimmed.slice(0, 120),
      });
      continue;
    }

    if (fragment.offScreen) {
      hits.push({
        kind: "off-screen",
        label: "rendered off-screen",
        excerpt: trimmed.slice(0, 120),
      });
    }
  }

  return {
    hits,
    hasPromptInjection: hits.some((hit) => hit.kind === "prompt-injection"),
    hasInvisibleText: hits.some((hit) => hit.kind === "invisible-text"),
    hasTinyText: hits.some((hit) => hit.kind === "tiny-text"),
  };
}
