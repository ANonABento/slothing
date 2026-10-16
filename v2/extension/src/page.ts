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
    .replace(/\s*[*✱]\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const visible = (el: Element) => {
  if (!(el as HTMLElement).getClientRects().length) return false;
  const st = getComputedStyle(el);
  return st.visibility !== "hidden" && st.display !== "none";
};

/**
 * The text you see in an element, without controls, buttons or hidden parts (a label that wraps its
 * input, a select's options, Lever's "Analyzing resume…" status). Read from the live element, not a
 * copy, because only the live one knows what CSS hides.
 */
function visibleText(root: Element): string {
  let out = "";
  const walk = (n: Node) => {
    if (n.nodeType === Node.TEXT_NODE) {
      out += n.textContent;
      return;
    }
    if (!(n instanceof HTMLElement)) return;
    if (n.matches("input, select, textarea, option, button, script, style, [role=listbox], [role=button], [aria-hidden=true]")) return;
    if (n !== root && !visible(n)) return;
    const block = getComputedStyle(n).display !== "inline";
    if (block) out += " ";
    n.childNodes.forEach(walk);
    if (block) out += " ";
  };
  walk(root);
  return clean(out);
}

const byIds = (ids: string | null) =>
  clean(
    (ids ?? "")
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.innerText ?? "")
      .join(" "),
  );

/** The question a control asks: its labels, aria, a fieldset legend, or the nearest text before it. */
function labelOf(el: Control, nearby = true): string {
  const aria = byIds(el.getAttribute("aria-labelledby"));
  if (aria) return aria;
  if (el.labels?.length) {
    const t = clean([...el.labels].map(visibleText).join(" "));
    if (t) return t;
  }
  const ariaLabel = clean(el.getAttribute("aria-label"));
  if (ariaLabel) return ariaLabel;
  return nearby ? nearbyText(el) : "";
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
  const legendEl = fs?.querySelector("legend");
  const legend = legendEl ? visibleText(legendEl) : "";
  if (legend) return legend;
  const group = radio.closest("[role=radiogroup]");
  if (group) {
    const t = byIds(group.getAttribute("aria-labelledby")) || clean(group.getAttribute("aria-label"));
    if (t) return t;
  }
  // The smallest container holding every radio of the group, then the text just above it.
  let box: Element | null = radio.parentElement;
  while (box && !all.every((r) => box!.contains(r))) box = box.parentElement;
  return box ? nearbyText(box) || (fs ? visibleText(fs) : "").slice(0, 300) : "";
}

const optionLabel = (r: HTMLInputElement) => clean(r.labels?.[0] ? visibleText(r.labels[0]) : r.nextSibling?.textContent) || clean(r.value);

const PLACEHOLDER = /^(select|choose|please|--|—|pick)/i;
const selectedText = (s: HTMLSelectElement) => {
  const o = s.selectedOptions[0];
  return !o || !o.value || PLACEHOLDER.test(o.text.trim()) ? "" : clean(o.text);
};

/** A searchable dropdown (react-select and the like): a text input whose options appear as you type. */
const isCombo = (el: Element) => el instanceof HTMLInputElement && (el.getAttribute("role") === "combobox" || el.getAttribute("aria-autocomplete") === "list");

/** What a searchable dropdown shows as chosen: react-select's "single value", else nothing. */
function comboValue(el: Control): string {
  const box = el.closest('[class*="__control"], [class*="-control"]');
  const v = box?.querySelector('[class*="single-value"], [class*="singleValue"], [class*="multi-value"]');
  return v ? clean((v as HTMLElement).innerText) : (el as HTMLInputElement).value.trim();
}

// What an upload button says, rather than what it's for.
const GENERIC_FILE = /^(attach|upload|choose|browse|select|drop|add)\b.{0,30}$/i;

/** A file input's purpose: its label unless that's just "Attach", then the text above its group. */
function fileLabel(el: HTMLInputElement): string {
  // "Resume/CV ATTACH RESUME/CV" (Lever): the label, without the button text inside it.
  // Its own label only: for an upload, the text above it is often unrelated (Ashby's page tabs).
  const own = labelOf(el, false).replace(/\s+(attach|upload|choose|browse)\b.*$/i, "");
  if (own && !GENERIC_FILE.test(own)) return own;
  let box: Element | null = el.parentElement;
  for (let i = 0; box && i < 4; i++, box = box.parentElement) {
    // A small upload box says what it's for itself ("Autofill from resume · Upload your resume here…").
    const boxText = visibleText(box);
    if (boxText.length > 12 && boxText.length <= 160 && !GENERIC_FILE.test(boxText)) return boxText;
    const heading = box.querySelector("label, legend, h3, h4, [class*=label]");
    const t = heading && !heading.contains(el) ? visibleText(heading) : "";
    if (t && !GENERIC_FILE.test(t)) return t;
    const near = nearbyText(box);
    if (near && !GENERIC_FILE.test(near)) return near;
  }
  return own || nearbyText(el);
}

const KIND: Record<string, FormField["kind"]> = { email: "email", tel: "tel", url: "url", number: "number", date: "date", text: "text", "": "text", file: "file", radio: "radio" };

// Continues from tags a previous injection left, so ids stay unique when the popup is opened again.
let counter = Math.max(0, ...[...document.querySelectorAll(`[${ATTR}]`)].map((e) => Number(e.getAttribute(ATTR)) || 0));
const tag = (el: Element) => {
  if (!el.hasAttribute(ATTR)) el.setAttribute(ATTR, String(++counter));
  return el.getAttribute(ATTR)!;
};

/** Every fillable field in this frame, in page order. `combos` counts the searchable dropdowns among them. */
function read(): { fields: FormField[]; combos: number; frames: number } {
  const fields: FormField[] = [];
  const radios = new Map<string, HTMLInputElement[]>();
  let combos = 0;
  for (const el of document.querySelectorAll<Control>("input, textarea, select")) {
    if (el.disabled || (el as HTMLInputElement).readOnly) continue;
    const type = el instanceof HTMLInputElement ? el.type.toLowerCase() : el instanceof HTMLSelectElement ? "select" : "textarea";
    // File inputs are usually hidden behind a styled button, so they're kept when invisible.
    if (type !== "file" && !visible(el)) continue;
    // Helper inputs a widget hides from you (react-select's "required" input), not questions.
    if (type !== "file" && (el.getAttribute("aria-hidden") === "true" || el.tabIndex < 0)) continue;
    if (isCombo(el)) {
      combos++;
      fields.push({ id: tag(el), kind: "select", label: labelOf(el), name: el.name || el.id, placeholder: "", autocomplete: "", options: [], required: el.getAttribute("aria-required") === "true", value: comboValue(el) });
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
      label: kind === "file" ? fileLabel(el as HTMLInputElement) : labelOf(el),
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
function setValue(el: HTMLInputElement | HTMLTextAreaElement, value: string, commit = true) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  if (!commit) return;
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Poll until `get` returns something, or give up after `ms`. */
async function waitFor<T>(get: () => T | null, ms: number): Promise<T | null> {
  for (let t = 0; t < ms; t += 100) {
    const v = get();
    if (v) return v;
    await sleep(100);
  }
  return get();
}

/**
 * Choose in a searchable dropdown: open it, pick the option that matches; if none shows, type the
 * answer to search and pick from the results. `loose` (a profile value like a city) takes the first
 * result when none matches exactly, since "Chicago, IL" is listed as "Chicago, Illinois, United States".
 */
async function pickCombo(el: HTMLInputElement, value: string, loose: boolean): Promise<boolean> {
  // This dropdown's own options: in its container (react-select's menu), the list it points at, or else
  // ones that appeared after it opened. A page can have other lists open or always rendered (a phone country picker).
  const OPTION = '[role="option"], [class*="__option"]';
  const before = new Set(document.querySelectorAll(OPTION));
  const options = () => {
    // The widget's root: the control's parent holds its menu (react-select's "…__control" + "…__menu").
    const own = (el.closest('[class*="__control"], [class*="-control"]')?.parentElement ?? null)?.querySelectorAll<HTMLElement>(OPTION);
    const owned = document.getElementById(el.getAttribute("aria-controls") || el.getAttribute("aria-owns") || "")?.querySelectorAll<HTMLElement>(OPTION);
    const fresh = [...document.querySelectorAll<HTMLElement>(OPTION)].filter((o) => !before.has(o));
    const list = [...(own?.length ? own : owned?.length ? owned : fresh)].filter(visible);
    return list.length ? list : null;
  };
  const pick = (list: HTMLElement[] | null) => (list ? matchOption(value, list.map((o) => o.innerText)) : -1);
  // A whole press, as a click would send it: react-select opens on mousedown, Greenhouse's wrapper on mouseup.
  const press = (type: string) => new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, view: window });
  el.dispatchEvent(press("mousedown"));
  el.focus();
  el.dispatchEvent(press("mouseup"));
  el.dispatchEvent(press("click"));
  let list = await waitFor(options, 600);
  let i = pick(list);
  if (i < 0) {
    setValue(el, value, false);
    // Search results can take a moment (a location lookup); wait for one that matches.
    list = await waitFor(() => (pick(options()) >= 0 ? options() : null), 2500);
    if (!list && loose) list = options();
    i = list ? Math.max(pick(list), loose ? 0 : -1) : -1;
  }
  if (!list || i < 0) {
    setValue(el, "", false);
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", code: "Escape", bubbles: true }));
    el.blur();
    return false;
  }
  list[i].dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  list[i].click();
  await sleep(50);
  el.blur();
  return true;
}

export interface PageFill {
  id: string;
  value?: string;
  option?: number;
  /** For a searchable dropdown filled from the profile: take the closest search result. */
  loose?: boolean;
  file?: { name: string; base64: string };
}

/** Fill fields from a plan. Returns the ids actually filled (a field can vanish between read and fill). */
async function fill(fills: PageFill[]): Promise<string[]> {
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
    } else if (isCombo(el)) {
      if (!(await pickCombo(el as HTMLInputElement, f.value ?? "", Boolean(f.loose)))) continue;
      mark(el.closest('[class*="__control"], [class*="-control"]') ?? el);
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
