// P3 — ATS submit-adapter contract.
//
// An adapter knows, for one ATS, where the application form lives and which
// element submits it. The shared field-match layer does the actual fill, so
// adapters stay thin. Hosts with no adapter are explicitly `needs_human`.

export type SubmitAdapterKey = "greenhouse" | "lever";

export interface SubmitAdapter {
  key: SubmitAdapterKey;
  /** True when this adapter handles the given hostname. */
  matches(host: string): boolean;
  /** The form element to scope field matching to (null = not found). */
  getFormScope(doc: Document): Element | null;
  /** The element that submits the application (null = not found). */
  getSubmitButton(doc: Document): HTMLElement | null;
}

/** Result of an attempted submission, reported back to Slothing. */
export interface SubmitResult {
  ok: boolean;
  /** True when the page's ATS isn't supported and a human must finish. */
  needsHuman?: boolean;
  /** ATS reference / confirmation, if the page exposed one. */
  atsRef?: string;
  error?: string;
  /** How many fields were filled (useful even on dry-run). */
  filled: number;
  /** True when fill ran but submit was intentionally NOT clicked. */
  dryRun?: boolean;
}

/** Find the first matching submit element from a list of selectors + label text. */
export function findSubmitBySelectors(
  doc: Document,
  selectors: string[],
  labelPatterns: RegExp[],
): HTMLElement | null {
  for (const selector of selectors) {
    const el = doc.querySelector<HTMLElement>(selector);
    if (el) return el;
  }
  // Fallback: any button/submit whose text matches an apply/submit pattern.
  const buttons = Array.from(
    doc.querySelectorAll<HTMLElement>(
      "button, input[type=submit], [role=button]",
    ),
  );
  for (const btn of buttons) {
    const text = (
      btn.textContent ||
      btn.getAttribute("value") ||
      btn.getAttribute("aria-label") ||
      ""
    ).trim();
    if (labelPatterns.some((re) => re.test(text))) return btn;
  }
  return null;
}
