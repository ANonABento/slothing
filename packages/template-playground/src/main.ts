import {
  DEFAULT_TEMPLATES,
  DENSITIES,
  FONT_CLASSES,
  COLUMN_LAYOUTS,
  HEADER_STYLES,
  SECTION_TITLE_STYLES,
  BULLET_STYLES,
  ALL_FIXTURES,
  renderHtml,
  renderTypeset,
  type ColumnLayout,
  type Density,
  type FontClass,
  type HeaderStyle,
  type SectionTitleStyle,
  type BulletStyle,
  type ResumeTemplate,
} from "@slothing/shared/resume-template";

import { browserTypstCompiler } from "./typst-compiler";

/**
 * Template playground — the manual-verify surface (spec §7/§11). Phase 1 wires the
 * REAL renderHtml + a live in-browser Typst compile, with an engine toggle so HTML
 * and Typeset render side-by-side to tune drift. Phase 3 adds original-PDF drag-drop.
 */

type Engine = "html" | "typeset" | "both";

const state = {
  templateId: DEFAULT_TEMPLATES[0].id,
  rdmIndex: 0,
  engine: "both" as Engine,
  accent: DEFAULT_TEMPLATES[0].tokens.accent,
  fontClass: DEFAULT_TEMPLATES[0].tokens.fontClass as FontClass,
  columns: DEFAULT_TEMPLATES[0].grammar.columns as ColumnLayout,
  header: DEFAULT_TEMPLATES[0].grammar.header as HeaderStyle,
  sectionTitle: DEFAULT_TEMPLATES[0].grammar.sectionTitle as SectionTitleStyle,
  bullets: DEFAULT_TEMPLATES[0].grammar.bullets as BulletStyle,
  density: DEFAULT_TEMPLATES[0].grammar.density as Density,
};

function currentTemplate(): ResumeTemplate {
  const base = DEFAULT_TEMPLATES.find((t) => t.id === state.templateId) ?? DEFAULT_TEMPLATES[0];
  return {
    ...base,
    grammar: {
      ...base.grammar,
      columns: state.columns,
      header: state.header,
      sectionTitle: state.sectionTitle,
      bullets: state.bullets,
      density: state.density,
    },
    tokens: { ...base.tokens, accent: state.accent, fontClass: state.fontClass },
  };
}

let typesetToken = 0;

function renderPanes() {
  const tpl = currentTemplate();
  const rdm = ALL_FIXTURES[state.rdmIndex].rdm;

  const htmlPane = document.getElementById("html-pane") as HTMLDivElement;
  const typesetPane = document.getElementById("typeset-pane") as HTMLDivElement;
  htmlPane.style.display = state.engine === "typeset" ? "none" : "flex";
  typesetPane.style.display = state.engine === "html" ? "none" : "flex";

  // HTML pane — instant.
  const { html } = renderHtml(tpl, rdm);
  (document.getElementById("html-frame") as HTMLIFrameElement).srcdoc = html;

  // Typeset pane — compile Typst → PDF in-browser (async).
  if (state.engine !== "html") {
    const { src } = renderTypeset(tpl, rdm);
    const status = document.getElementById("typeset-status")!;
    status.textContent = "Compiling Typst…";
    const myToken = ++typesetToken;
    browserTypstCompiler
      .compile(src)
      .then((pdf) => {
        if (myToken !== typesetToken) return; // a newer render superseded this one
        const blob = new Blob([pdf.slice() as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
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

function opt(v: string, label = v, selected = false): string {
  return `<option value="${v}"${selected ? " selected" : ""}>${label}</option>`;
}

function buildForm() {
  const form = document.getElementById("form")!;
  form.innerHTML = `
    <label>Engine</label>
    <select id="engine">
      ${opt("both", "HTML + Typeset", true)}${opt("html", "HTML only")}${opt("typeset", "Typeset only")}
    </select>
    <label>Template</label>
    <select id="tpl">${DEFAULT_TEMPLATES.map((t) => opt(t.id, t.name)).join("")}</select>
    <label>Sample resume</label>
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
    state.templateId = (e.target as HTMLSelectElement).value;
    const base = DEFAULT_TEMPLATES.find((t) => t.id === state.templateId)!;
    state.accent = base.tokens.accent;
    state.fontClass = base.tokens.fontClass;
    state.columns = base.grammar.columns;
    state.header = base.grammar.header;
    state.sectionTitle = base.grammar.sectionTitle;
    state.bullets = base.grammar.bullets;
    state.density = base.grammar.density;
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
  setVal("tpl", state.templateId);
  setVal("accent", state.accent);
  setVal("font", state.fontClass);
  setVal("columns", state.columns);
  setVal("header", state.header);
  setVal("sectionTitle", state.sectionTitle);
  setVal("bullets", state.bullets);
  setVal("density", state.density);
}

buildForm();
renderPanes();
