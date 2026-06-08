// P3 — Field matching + filling for agent-driven application submission.
//
// Given a set of drafted answers (each carrying the screening question's label)
// and a form scope on the page, resolve each answer to its input element by
// label/name/placeholder text and write the value with the input + change
// events real frameworks listen for. Pure DOM — unit-tested under jsdom.
//
// Reused by every ATS submit adapter; the adapters only contribute the form
// scope + submit-button selectors.

export interface AnswerFill {
  questionId: string;
  /** The screening question label as the agent saw it. */
  label: string;
  value: string;
}

type Fillable = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

/** Lower-case, collapse whitespace, drop trailing "*"/":" required markers. */
export function normalizeLabel(text: string): string {
  return text.toLowerCase().replace(/[*:]+/g, " ").replace(/\s+/g, " ").trim();
}

/** Best-effort human label for an input: <label for>, wrapping label, aria, name. */
export function labelForField(el: Fillable, root: ParentNode): string {
  const id = el.getAttribute("id");
  if (id) {
    const escaped =
      typeof CSS !== "undefined" && CSS.escape ? CSS.escape(id) : id;
    const explicit = root.querySelector(`label[for="${escaped}"]`);
    if (explicit?.textContent) return explicit.textContent;
  }
  const wrapping = el.closest("label");
  if (wrapping?.textContent) return wrapping.textContent;
  const aria = el.getAttribute("aria-label");
  if (aria) return aria;
  const placeholder = el.getAttribute("placeholder");
  if (placeholder) return placeholder;
  return el.getAttribute("name") ?? "";
}

function isFillable(el: Element): el is Fillable {
  const tag = el.tagName.toLowerCase();
  if (tag === "textarea" || tag === "select") return true;
  if (tag === "input") {
    const type = (el.getAttribute("type") ?? "text").toLowerCase();
    return !["submit", "button", "hidden", "file", "image", "reset"].includes(
      type,
    );
  }
  return false;
}

/**
 * Find the field within `root` whose label best matches `label`. Prefers an
 * exact normalized match, then a contains match (either direction). Returns the
 * first unfilled candidate.
 */
export function findFieldByLabel(
  root: ParentNode,
  label: string,
): Fillable | null {
  const target = normalizeLabel(label);
  if (!target) return null;
  const candidates = Array.from(
    root.querySelectorAll("input, textarea, select"),
  )
    .filter(isFillable)
    .map((el) => ({ el, text: normalizeLabel(labelForField(el, root)) }))
    .filter((c) => c.text.length > 0);

  const exact = candidates.find((c) => c.text === target);
  if (exact) return exact.el;

  // Bidirectional substring match, but: (a) ignore tiny labels like a bare
  // `name="name"` attribute that would spuriously match "first name", and
  // (b) prefer the closest-length candidate so the most specific field wins.
  const contains = candidates
    .filter(
      (c) =>
        Math.min(c.text.length, target.length) >= 3 &&
        (c.text.includes(target) || target.includes(c.text)),
    )
    .sort(
      (a, b) =>
        Math.abs(a.text.length - target.length) -
        Math.abs(b.text.length - target.length),
    );
  return contains.length > 0 ? contains[0].el : null;
}

function setNativeValue(el: Fillable, value: string): void {
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

/** Write `value` into a field, returning whether it took. */
export function fillField(el: Fillable, value: string): boolean {
  const tag = el.tagName.toLowerCase();
  if (tag === "select") {
    const select = el as HTMLSelectElement;
    const wanted = normalizeLabel(value);
    const option = Array.from(select.options).find(
      (o) =>
        normalizeLabel(o.value) === wanted ||
        normalizeLabel(o.textContent ?? "") === wanted,
    );
    if (!option) return false;
    select.value = option.value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  if (tag === "input") {
    const input = el as HTMLInputElement;
    const type = (input.getAttribute("type") ?? "text").toLowerCase();
    if (type === "checkbox") {
      const truthy = ["yes", "true", "1", "on", "checked"].includes(
        normalizeLabel(value),
      );
      input.checked = truthy;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }
  }

  setNativeValue(el, value);
  return el.value === value;
}

/**
 * Fill every answer that can be matched within `scope`. Returns the count of
 * fields successfully written.
 */
export function fillAnswersInScope(
  scope: ParentNode,
  answers: AnswerFill[],
): number {
  let filled = 0;
  for (const answer of answers) {
    if (!answer.value) continue;
    const field = findFieldByLabel(scope, answer.label);
    if (field && fillField(field, answer.value)) filled += 1;
  }
  return filled;
}
