import { matchOption } from "@/lib/answers";
import type { FormField } from "@/lib/autofill";

/* ─── Runs inside the page (every frame), only when you click something in the popup ───
 * Reads the form's fields, fills them, attaches PDFs, and reads the posting. Elements are tagged with
 * data-slothing-field so a later call finds the same field. Exposed as globalThis.__slothing; the
 * popup injects this file, then calls one of its functions.
 */

const ATTR = "data-slothing-field";
const FILLED = "data-slothing-filled";

type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const clean = (s: string | null | undefined) =>
  (s ?? "")
    .replace(/\s+/g, " ")
    .replace(/\s*\*\s*$/, "")
    .trim();

const visible = (el: Element) => {
  if (!(el as HTMLElement).getClientRects().length) return false;
  const st = getComputedStyle(el);
  return st.visibility !== "hidden" && st.display !== "none";
};

/** Text of an element without the control itself (a <label> that wraps its input), or its options. */
function textWithout(container: Element): string {
  const copy = container.cloneNode(true) as Element;
  copy.querySelectorAll("input, select, textarea, option, [role=listbox]").forEach((n) => n.remove());
  return clean((copy as HTMLElement).innerText ?? copy.textContent);
}

const byIds = (ids: string | null) =>
  clean(
    (ids ?? "")
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.innerText ?? "")
      .join(" "),
  );

/** The question a control asks: its labels, aria, a fieldset legend, or the nearest text before it. */
function labelOf(el: Control): string {
  const aria = byIds(el.getAttribute("aria-labelledby"));
  if (aria) return aria;
  if (el.labels?.length) {
    const t = clean([...el.labels].map((l) => textWithout(l)).join(" "));
    if (t) return t;
  }
  const ariaLabel = clean(el.getAttribute("aria-label"));
  if (ariaLabel) return ariaLabel;
  return nearbyText(el);
}

/** The closest short text above a control, for forms whose labels aren't tied to their inputs. */
function nearbyText(el: Element): string {
  let node: Element | null = el;
  for (let depth = 0; node && depth < 4; depth++) {
    let sib = node.previousElementSibling;
    while (sib) {
      if (!sib.querySelector("input, select, textarea")) {
        const t = clean((sib as HTMLElement).innerText);
        if (t && t.length <= 300) return t;
      }
      sib = sib.previousElementSibling;
    }
    node = node.parentElement;
    if (node?.tagName === "FORM") break;
  }
  return "";
}

/** A radio group's question: its fieldset legend, a radiogroup's label, or the text above the group. */
function groupLabel(radio: HTMLInputElement, all: HTMLInputElement[]): string {
  const fs = radio.closest("fieldset");
  const legend = clean(fs?.querySelector("legend")?.innerText);
  if (legend) return legend;
  const group = radio.closest("[role=radiogroup]");
  if (group) {
    const t = byIds(group.getAttribute("aria-labelledby")) || clean(group.getAttribute("aria-label"));
    if (t) return t;
  }
  // The smallest container holding every radio of the group, then the text just above it.
  let box: Element | null = radio.parentElement;
  while (box && !all.every((r) => box!.contains(r))) box = box.parentElement;
  return box ? nearbyText(box) || clean(fs ? textWithout(fs) : "").slice(0, 300) : "";
}

const optionLabel = (r: HTMLInputElement) => clean(r.labels?.[0] ? textWithout(r.labels[0]) : r.nextSibling?.textContent) || clean(r.value);

const PLACEHOLDER = /^(select|choose|please|--|—|pick)/i;
const selectedText = (s: HTMLSelectElement) => {
  const o = s.selectedOptions[0];
  return !o || !o.value || PLACEHOLDER.test(o.text.trim()) ? "" : clean(o.text);
};

const KIND: Record<string, FormField["kind"]> = { email: "email", tel: "tel", url: "url", number: "number", date: "date", text: "text", "": "text", file: "file", radio: "radio" };

// Continues from tags a previous injection left, so ids stay unique when the popup is opened again.
let counter = Math.max(0, ...[...document.querySelectorAll(`[${ATTR}]`)].map((e) => Number(e.getAttribute(ATTR)) || 0));
const tag = (el: Element) => {
  if (!el.hasAttribute(ATTR)) el.setAttribute(ATTR, String(++counter));
  return el.getAttribute(ATTR)!;
};

/** Every fillable field in this frame, in page order. Custom dropdowns (role=combobox) are counted, not read. */
function read(): { fields: FormField[]; combos: number; frames: number } {
  const fields: FormField[] = [];
  const radios = new Map<string, HTMLInputElement[]>();
  let combos = 0;
  for (const el of document.querySelectorAll<Control>("input, textarea, select")) {
    if (el.disabled || (el as HTMLInputElement).readOnly) continue;
    const type = el instanceof HTMLInputElement ? el.type.toLowerCase() : el instanceof HTMLSelectElement ? "select" : "textarea";
    // File inputs are usually hidden behind a styled button, so they're kept when invisible.
    if (type !== "file" && !visible(el)) continue;
    if (el.getAttribute("role") === "combobox" || el.getAttribute("aria-autocomplete") === "list") {
      combos++;
      continue;
    }
    if (type === "radio") {
      const key = `${el.closest("form") ? tag(el.closest("form")!) : ""}:${(el as HTMLInputElement).name || tag(el)}`;
      radios.set(key, [...(radios.get(key) ?? []), el as HTMLInputElement]);
      continue;
    }
    const kind = type === "select" ? "select" : type === "textarea" ? "textarea" : KIND[type];
    if (!kind) continue; // checkbox, password, hidden, buttons…
    fields.push({
      id: tag(el),
      kind,
      label: labelOf(el),
      name: el.name || el.id,
      placeholder: "placeholder" in el ? clean(el.placeholder) : "",
      autocomplete: el.getAttribute("autocomplete") ?? "",
      options: el instanceof HTMLSelectElement ? [...el.options].map((o) => clean(o.text)) : [],
      required: el.required || el.getAttribute("aria-required") === "true",
      value: el instanceof HTMLSelectElement ? selectedText(el) : kind === "file" ? (el as HTMLInputElement).files?.[0]?.name ?? "" : el.value.trim(),
    });
  }
  for (const group of radios.values()) {
    const id = tag(group[0]);
    group.forEach((r) => r.setAttribute(ATTR, id));
    const checked = group.find((r) => r.checked);
    fields.push({
      id,
      kind: "radio",
      label: groupLabel(group[0], group),
      name: group[0].name,
      placeholder: "",
      autocomplete: "",
      options: group.map(optionLabel),
      required: group.some((r) => r.required),
      value: checked ? optionLabel(checked) : "",
    });
  }
  // Frames from another site (an embedded Greenhouse form) need host access before they can be read.
  const frames = [...document.querySelectorAll("iframe")].filter((f) => {
    try {
      return visible(f) && new URL(f.src, location.href).origin !== location.origin;
    } catch {
      return false;
    }
  }).length;
  return { fields: fields.sort((a, b) => position(a.id) - position(b.id)), combos, frames };
}

const all = (id: string) => [...document.querySelectorAll<Control>(`[${ATTR}="${CSS.escape(id)}"]`)];
const position = (id: string) => {
  const el = all(id)[0];
  return el ? [...document.querySelectorAll(`[${ATTR}]`)].indexOf(el) : 0;
};

/** Set a value the way typing does, so React and other frameworks see the change. */
function setValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
  el.dispatchEvent(new FocusEvent("blur"));
}

function mark(el: Element) {
  const target = el instanceof HTMLInputElement && el.type === "radio" ? (el.closest("fieldset, [role=radiogroup]") ?? el.parentElement ?? el) : el;
  target.setAttribute(FILLED, "");
  if (!document.getElementById("slothing-style")) {
    const style = document.createElement("style");
    style.id = "slothing-style";
    // The page's own document, so the app's color tokens aren't here: Slothing's brand rust, by value.
    style.textContent = `[${FILLED}] { outline: 2px solid rgba(184, 112, 74, 0.65) !important; outline-offset: 2px !important; }`;
    document.head.append(style);
  }
}

export interface PageFill {
  id: string;
  value?: string;
  option?: number;
  file?: { name: string; base64: string };
}

/** Fill fields from a plan. Returns the ids actually filled (a field can vanish between read and fill). */
function fill(fills: PageFill[]): string[] {
  const done: string[] = [];
  for (const f of fills) {
    const els = all(f.id);
    const el = els[0];
    if (!el) continue;
    if (f.file && el instanceof HTMLInputElement && el.type === "file") {
      const bytes = Uint8Array.from(atob(f.file.base64), (c) => c.charCodeAt(0));
      const dt = new DataTransfer();
      dt.items.add(new File([bytes], f.file.name, { type: "application/pdf" }));
      el.files = dt.files;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      mark(el.closest("label, div") ?? el);
    } else if (el instanceof HTMLSelectElement) {
      // Options were read in order, so the index is the option to pick; text is the fallback if the list changed.
      const i = f.option !== undefined && clean(el.options[f.option]?.text) === f.value ? f.option : matchOption(f.value ?? "", [...el.options].map((o) => o.text));
      if (i < 0) continue;
      el.selectedIndex = i;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      mark(el);
    } else if (el instanceof HTMLInputElement && el.type === "radio") {
      const radios = els as HTMLInputElement[];
      const i = matchOption(f.value ?? "", radios.map(optionLabel));
      if (i < 0) continue;
      // A click, not .checked: frameworks listen for it.
      radios[i].click();
      mark(radios[i]);
    } else if (f.value !== undefined && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
      setValue(el, f.value);
      mark(el);
    } else continue;
    done.push(f.id);
  }
  return done;
}

/** The page as you see it, for saving the posting: rendered HTML (for its structured data) and visible text. */
function posting() {
  return {
    url: location.href,
    title: document.title,
    html: document.documentElement.outerHTML.slice(0, 5_000_000),
    text: (document.body?.innerText ?? "").slice(0, 100_000),
  };
}

/** Scroll a field into view and outline it, from the popup's "left for you" list. */
function reveal(id: string) {
  const el = all(id)[0];
  if (!el) return false;
  el.scrollIntoView({ block: "center", behavior: "smooth" });
  (el as HTMLElement).focus({ preventScroll: true });
  return true;
}

const api = { read, fill, posting, reveal };
export type PageApi = typeof api;
(globalThis as unknown as { __slothing: PageApi }).__slothing = api;
