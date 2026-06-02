import {
  DEFAULT_TEMPLATES,
  DENSITIES,
  FONT_CLASSES,
  SAMPLE_RDMS,
  stubRenderHtml,
  type Density,
  type FontClass,
  type ResumeTemplate,
} from "@slothing/shared/resume-template";

/**
 * Phase 0 playground: pick a template + sample resume, nudge tokens, see the
 * render live. Wiring proves `@slothing/shared/resume-template` imports cleanly
 * with full devtools. Phase 1 fills in the real renderer; Phase 3 adds the
 * original-PDF side-by-side + HTML/Typeset toggle. See spec §7/§11.
 */

const state = {
  templateId: DEFAULT_TEMPLATES[0].id,
  rdmIndex: 0,
  accent: DEFAULT_TEMPLATES[0].tokens.accent,
  fontClass: DEFAULT_TEMPLATES[0].tokens.fontClass as FontClass,
  density: DEFAULT_TEMPLATES[0].grammar.density as Density,
};

function currentTemplate(): ResumeTemplate {
  const base = DEFAULT_TEMPLATES.find((t) => t.id === state.templateId) ?? DEFAULT_TEMPLATES[0];
  // Apply live token/grammar nudges over the base template.
  return {
    ...base,
    grammar: { ...base.grammar, density: state.density },
    tokens: { ...base.tokens, accent: state.accent, fontClass: state.fontClass },
  };
}

function render() {
  const tpl = currentTemplate();
  const rdm = SAMPLE_RDMS[state.rdmIndex];
  const { html } = stubRenderHtml(tpl, rdm);
  (document.getElementById("preview") as HTMLIFrameElement).srcdoc = html;
}

function buildForm() {
  const form = document.getElementById("form")!;
  const opt = (v: string, label = v) => `<option value="${v}">${label}</option>`;

  form.innerHTML = `
    <label>Template</label>
    <select id="tpl">${DEFAULT_TEMPLATES.map((t) => opt(t.id, t.name)).join("")}</select>
    <label>Sample resume</label>
    <select id="rdm">${SAMPLE_RDMS.map((r, i) => opt(String(i), r.basics.name)).join("")}</select>
    <label>Accent</label>
    <input id="accent" type="color" value="${state.accent}" />
    <label>Font class</label>
    <select id="font">${FONT_CLASSES.map((f) => opt(f)).join("")}</select>
    <label>Density</label>
    <select id="density">${DENSITIES.map((d) => opt(d)).join("")}</select>
  `;

  const bind = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

  bind<HTMLSelectElement>("tpl").onchange = (e) => {
    state.templateId = (e.target as HTMLSelectElement).value;
    const base = DEFAULT_TEMPLATES.find((t) => t.id === state.templateId)!;
    state.accent = base.tokens.accent;
    state.fontClass = base.tokens.fontClass;
    state.density = base.grammar.density;
    syncInputs();
    render();
  };
  bind<HTMLSelectElement>("rdm").onchange = (e) => {
    state.rdmIndex = Number((e.target as HTMLSelectElement).value);
    render();
  };
  bind<HTMLInputElement>("accent").oninput = (e) => {
    state.accent = (e.target as HTMLInputElement).value;
    render();
  };
  bind<HTMLSelectElement>("font").onchange = (e) => {
    state.fontClass = (e.target as HTMLSelectElement).value as FontClass;
    render();
  };
  bind<HTMLSelectElement>("density").onchange = (e) => {
    state.density = (e.target as HTMLSelectElement).value as Density;
    render();
  };

  syncInputs();
}

function syncInputs() {
  (document.getElementById("tpl") as HTMLSelectElement).value = state.templateId;
  (document.getElementById("accent") as HTMLInputElement).value = state.accent;
  (document.getElementById("font") as HTMLSelectElement).value = state.fontClass;
  (document.getElementById("density") as HTMLSelectElement).value = state.density;
}

buildForm();
render();
