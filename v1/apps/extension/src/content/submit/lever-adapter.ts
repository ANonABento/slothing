// P3 — Lever submit adapter.
//
// Lever application forms live at jobs.lever.co/<co>/<id>/apply and use a
// `.application-form` / `form[action*='lever']` container with a
// "Submit application" button.

import { type SubmitAdapter, findSubmitBySelectors } from "./submit-adapter";

const FORM_SELECTORS = [
  "form.application-form",
  "form[action*='lever']",
  "[data-qa='application-form']",
];

// Only Lever-specific selectors — a bare `button[type=submit]` would match the
// first submit button on the page. Unmatched pages fall through to the
// label-text scan in findSubmitBySelectors (fails safe rather than mis-clicking).
const SUBMIT_SELECTORS = [".template-btn-submit", "[data-qa='btn-submit']"];

const SUBMIT_LABELS = [/submit application/i, /^submit$/i];

export const leverAdapter: SubmitAdapter = {
  key: "lever",
  matches(host: string) {
    return /(^|\.)lever\.co$/.test(host) || host.includes("lever.co");
  },
  getFormScope(doc) {
    for (const selector of FORM_SELECTORS) {
      const el = doc.querySelector(selector);
      if (el) return el;
    }
    return doc.querySelector("form");
  },
  getSubmitButton(doc) {
    return findSubmitBySelectors(doc, SUBMIT_SELECTORS, SUBMIT_LABELS);
  },
};
