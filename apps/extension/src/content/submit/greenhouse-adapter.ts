// P3 — Greenhouse submit adapter.
//
// Greenhouse application forms (hosted at boards.greenhouse.io/<co>/jobs/<id>
// and embedded greenhouse iframes) use a stable `#application-form` / `#application`
// container and a submit input/button labelled "Submit application".

import { type SubmitAdapter, findSubmitBySelectors } from "./submit-adapter";

const FORM_SELECTORS = [
  "#application-form",
  "#application",
  "form#application_form",
  "form[action*='greenhouse']",
];

const SUBMIT_SELECTORS = [
  "#submit_app",
  "input[type=submit][value*='Submit' i]",
  "button[type=submit]",
];

const SUBMIT_LABELS = [/submit application/i, /^submit$/i];

export const greenhouseAdapter: SubmitAdapter = {
  key: "greenhouse",
  matches(host: string) {
    return /(^|\.)greenhouse\.io$/.test(host) || host.includes("greenhouse");
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
