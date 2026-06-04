import {
  DEFAULT_TEMPLATES,
  DENSITIES,
  FONT_CLASSES,
  COLUMN_LAYOUTS,
  HEADER_STYLES,
  SECTION_TITLE_STYLES,
  BULLET_STYLES,
  ALL_FIXTURES,
  getDefaultTemplate,
  applyNudges,
  renderHtml,
  renderTypeset,
  extractResume,
  extractRdmFromXmp,
  type ColumnLayout,
  type Density,
  type FontClass,
  type HeaderStyle,
  type SectionTitleStyle,
  type BulletStyle,
  type ResumeTemplate,
  type ResumeDocumentModel,
} from "@slothing/shared/resume-template";

import { browserTypstCompiler } from "./typst-compiler";
import { pdfToGeometry } from "./pdf-geometry";

/**
 * Template playground — the manual-verify milestone (spec §7/§11). Three panes:
 * the dropped ORIGINAL PDF, our HTML render, and our live Typst (WASM) render of the
 * SAME template definition. Dropping a PDF runs the real clone pipeline (XMP
 * self-import → else fingerprint + OpenResume content extraction), pre-selects /
 * pre-tunes a template, and renders the user's own content beside the original so
 * drift is tunable. This preview+nudge loop ports into Studio (Phase 4).
 */

type Engine = "html" | "typeset" | "both";

const FIRST = DEFAULT_TEMPLATES[0];

const state = {
  baseTemplateId: FIRST.id,
  /** Synthesized template from an upload (overrides the dropdown base when set). */
  syntheticBase: null as ResumeTemplate | null,
  rdmIndex: 0,
  /** RDM recovered/extracted from a dropped PDF (overrides the sample fixture). */
  rdmOverride: null as ResumeDocumentModel | null,
  engine: "both" as Engine,
  // grammar + token nudges
  accent: FIRST.tokens.accent,
  fontClass: FIRST.tokens.fontClass as FontClass,
  columns: FIRST.grammar.columns as ColumnLayout,
  header: FIRST.grammar.header as HeaderStyle,
  sectionTitle: FIRST.grammar.sectionTitle as SectionTitleStyle,
  bullets: FIRST.grammar.bullets as BulletStyle,
  density: FIRST.grammar.density as Density,
  originalUrl: null as string | null,
};

function baseTemplate(): ResumeTemplate {
  return state.syntheticBase ?? getDefaultTemplate(state.baseTemplateId) ?? FIRST;
}

function currentTemplate(): ResumeTemplate {
  return applyNudges(baseTemplate(), {
    grammar: {
      columns: state.columns,
      header: state.header,
      sectionTitle: state.sectionTitle,
      bullets: state.bullets,
      density: state.density,
    },
    tokens: { accent: state.accent, fontClass: state.fontClass },
  });
}

function currentRdm(): ResumeDocumentModel {
  return state.rdmOverride ?? ALL_FIXTURES[state.rdmIndex].rdm;
}

/** Sync the slider state to a template's axes (used after picking / extracting). */
function adoptTemplate(tpl: ResumeTemplate) {
  state.accent = tpl.tokens.accent;
  state.fontClass = tpl.tokens.fontClass;
  state.columns = tpl.grammar.columns;
  state.header = tpl.grammar.header;
  state.sectionTitle = tpl.grammar.sectionTitle;
  state.bullets = tpl.grammar.bullets;
  state.density = tpl.grammar.density;
}

let typesetToken = 0;

function renderPanes() {
  const tpl = currentTemplate();
  const rdm = currentRdm();

  const originalPane = document.getElementById("original-pane") as HTMLDivElement;
  const htmlPane = document.getElementById("html-pane") as HTMLDivElement;
  const typesetPane = document.getElementById("typeset-pane") as HTMLDivElement;

  const showOriginal = !!state.originalUrl;
  originalPane.style.display = showOriginal ? "flex" : "none";
  htmlPane.style.display = state.engine === "typeset" ? "none" : "flex";
  typesetPane.style.display = state.engine === "html" ? "none" : "flex";

  const cols = [showOriginal ? "1fr" : "", htmlPane.style.display !== "none" ? "1fr" : "", typesetPane.style.display !== "none" ? "1fr" : ""].filter(Boolean);
  (document.getElementById("panes") as HTMLDivElement).style.gridTemplateColumns = cols.join(" ");

  const { html } = renderHtml(tpl, rdm);
  (document.getElementById("html-frame") as HTMLIFrameElement).srcdoc = html;

  if (state.engine !== "html") {
    const { src } = renderTypeset(tpl, rdm);
    const status = document.getElementById("typeset-status")!;
    status.textContent = "Compiling Typst…";
    const myToken = ++typesetToken;
    browserTypstCompiler
      .compile(src)
      .then((pdf) => {
        if (myToken !== typesetToken) return;
        const url = URL.createObjectURL(new Blob([pdf.slice() as BlobPart], { type: "application/pdf" }));
        const frame = document.getElementById("typeset-frame") as HTMLIFrameElement;
        const prev = frame.dataset.url;
        frame.src = url;
        if (prev) URL.revokeObjectURL(prev);
        frame.dataset.url = url;
        status.textContent = "Typeset PDF (Typst WASM)";
      })
      .catch((err) => {
        if (myToken !== typesetToken) return;
        status.textContent = `Typst error: ${err?.message ?? err}`;
      });
  }
}

async function handlePdf(file: File) {
  const extractionEl = document.getElementById("extraction")!;
  extractionEl.textContent = "Parsing PDF…";
  const buf = await file.arrayBuffer();

  if (state.originalUrl) URL.revokeObjectURL(state.originalUrl);
  state.originalUrl = URL.createObjectURL(new Blob([buf], { type: "application/pdf" }));
  (document.getElementById("original-frame") as HTMLIFrameElement).src = state.originalUrl;

  // Fast path: our own export carries the RDM in XMP — restore it losslessly.
  const selfImport = extractRdmFromXmp(new Uint8Array(buf));
  if (selfImport) {
    state.rdmOverride = selfImport;
    extractionEl.textContent = "✓ Self-import: exact RDM restored from embedded XMP (no fingerprint/LLM).";
    renderPanes();
    return;
  }

  try {
    const geometry = await pdfToGeometry(buf);
    const result = await extractResume(geometry);
    if (result.route === "manual") {
      extractionEl.textContent = "Scanned / image PDF — no text layer. Pick a clean template manually.";
      renderPanes();
      return;
    }
    state.rdmOverride = result.rdm;
    state.syntheticBase = result.classification?.template ?? null;
    if (state.syntheticBase) adoptTemplate(state.syntheticBase);
    const fp = result.fingerprint!;
    const conf = (n: number) => `${Math.round(n * 100)}%`;
    extractionEl.textContent =
      `Fingerprint → synthesized template (pre-selected: ${result.suggestedTemplate.name}).\n` +
      `columns ${fp.columns.value} (${conf(fp.columns.confidence)}) · ` +
      `header ${fp.header.value} (${conf(fp.header.confidence)}) · ` +
      `font ${fp.fontClass.value} (${conf(fp.fontClass.confidence)}) · ` +
      `accent ${fp.accent.value} (${conf(fp.accent.confidence)})\n` +
      (result.classification?.usedDefaults.length
        ? `defaults used for: ${result.classification.usedDefaults.join(", ")}`
        : "all axes from upload") +
      (result.unknownHeaders.length ? `\nunknown headers: ${result.unknownHeaders.join(", ")}` : "");
    syncInputs();
    renderPanes();
  } catch (err) {
    extractionEl.textContent = `Extraction error: ${(err as Error)?.message ?? err}`;
  }
}

function opt(v: string, label = v): string {
  return `<option value="${v}">${label}</option>`;
}

function buildForm() {
  const form = document.getElementById("form")!;
  form.innerHTML = `
    <hr />
    <label>Engine</label>
    <select id="engine">${opt("both", "HTML + Typeset")}${opt("html", "HTML only")}${opt("typeset", "Typeset only")}</select>
    <label>Template</label>
    <select id="tpl">${DEFAULT_TEMPLATES.map((t) => opt(t.id, t.name)).join("")}</select>
    <label>Sample resume (when no PDF dropped)</label>
    <select id="rdm">${ALL_FIXTURES.map((f, i) => opt(String(i), f.name)).join("")}</select>
    <hr />
    <label>Accent</label>
    <input id="accent" type="color" value="${state.accent}" />
    <label>Font class</label>
    <select id="font">${FONT_CLASSES.map((f) => opt(f)).join("")}</select>
    <label>Columns</label>
    <select id="columns">${COLUMN_LAYOUTS.map((c) => opt(c)).join("")}</select>
    <label>Header</label>
    <select id="header">${HEADER_STYLES.map((h) => opt(h)).join("")}</select>
    <label>Section title</label>
    <select id="sectionTitle">${SECTION_TITLE_STYLES.map((s) => opt(s)).join("")}</select>
    <label>Bullets</label>
    <select id="bullets">${BULLET_STYLES.map((b) => opt(b)).join("")}</select>
    <label>Density</label>
    <select id="density">${DENSITIES.map((d) => opt(d)).join("")}</select>
  `;

  const bind = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const onSel = (id: string, set: (v: string) => void) => {
    bind<HTMLSelectElement>(id).onchange = (e) => {
      set((e.target as HTMLSelectElement).value);
      renderPanes();
    };
  };

  onSel("engine", (v) => (state.engine = v as Engine));
  bind<HTMLSelectElement>("tpl").onchange = (e) => {
    state.baseTemplateId = (e.target as HTMLSelectElement).value;
    state.syntheticBase = null;
    adoptTemplate(getDefaultTemplate(state.baseTemplateId)!);
    syncInputs();
    renderPanes();
  };
  onSel("rdm", (v) => (state.rdmIndex = Number(v)));
  bind<HTMLInputElement>("accent").oninput = (e) => {
    state.accent = (e.target as HTMLInputElement).value;
    renderPanes();
  };
  onSel("font", (v) => (state.fontClass = v as FontClass));
  onSel("columns", (v) => (state.columns = v as ColumnLayout));
  onSel("header", (v) => (state.header = v as HeaderStyle));
  onSel("sectionTitle", (v) => (state.sectionTitle = v as SectionTitleStyle));
  onSel("bullets", (v) => (state.bullets = v as BulletStyle));
  onSel("density", (v) => (state.density = v as Density));

  syncInputs();
}

function syncInputs() {
  const setVal = (id: string, v: string) => {
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
    if (el) el.value = v;
  };
  setVal("engine", state.engine);
  setVal("tpl", state.baseTemplateId);
  setVal("accent", state.accent);
  setVal("font", state.fontClass);
  setVal("columns", state.columns);
  setVal("header", state.header);
  setVal("sectionTitle", state.sectionTitle);
  setVal("bullets", state.bullets);
  setVal("density", state.density);
}

function wireDropzone() {
  const dz = document.getElementById("dropzone")!;
  const fileInput = document.getElementById("file") as HTMLInputElement;
  dz.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    if (fileInput.files?.[0]) void handlePdf(fileInput.files[0]);
  });
  dz.addEventListener("dragover", (e) => {
    e.preventDefault();
    dz.classList.add("drag");
  });
  dz.addEventListener("dragleave", () => dz.classList.remove("drag"));
  dz.addEventListener("drop", (e) => {
    e.preventDefault();
    dz.classList.remove("drag");
    const file = e.dataTransfer?.files?.[0];
    if (file) void handlePdf(file);
  });

  document.getElementById("clear-original")!.addEventListener("click", () => {
    if (state.originalUrl) URL.revokeObjectURL(state.originalUrl);
    state.originalUrl = null;
    state.rdmOverride = null;
    state.syntheticBase = null;
    document.getElementById("extraction")!.textContent = "";
    adoptTemplate(getDefaultTemplate(state.baseTemplateId)!);
    syncInputs();
    renderPanes();
  });
}

buildForm();
wireDropzone();
renderPanes();
