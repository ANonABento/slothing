// @vitest-environment jsdom
//
// Unit tests for the P2/#35 inline answer-bank decorator. We exercise:
//   - LABEL_MATCH_REGEX: positive + negative cases drawn straight from the
//     roadmap spec (docs/extension-roadmap-2026-05.md).
//   - shouldDecorateTextarea: every branch of the predicate
//     (length filter, label match, hidden/disabled exclusions).
//   - extractTextareaLabel: aria-label, aria-labelledby, label[for],
//     ancestor <label>, placeholder fallback.
//   - truncate: helper used to clip the 80-char answer preview.
//
// We do NOT import the React/createRoot-dependent decorator from this file —
// it's exercised by the screenshot harness in apps/extension/demo/_harness.mjs.

import { afterEach, describe, expect, it } from "vitest";

import {
  LABEL_MATCH_REGEX,
  LONG_TEXTAREA_MIN_MAXLENGTH,
  extractTextareaLabel,
  shouldDecorateTextarea,
  truncate,
} from "./answer-bank-button";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("LABEL_MATCH_REGEX (positive cases)", () => {
  const positives = [
    "Tell us about a time you led a team.",
    "Describe a challenge you've overcome at work",
    "Why are you interested in this role?",
    "Why this company over others?",
    "What motivates you to apply here?",
    "Describe your biggest challenge in the last year.",
    // Case-insensitive
    "TELL US ABOUT yourself",
    "describe a project you're proud of",
  ];

  for (const sample of positives) {
    it(`matches: "${sample}"`, () => {
      expect(LABEL_MATCH_REGEX.test(sample)).toBe(true);
    });
  }
});

describe("LABEL_MATCH_REGEX (negative cases)", () => {
  const negatives = [
    "Email address",
    "Phone number",
    "First name",
    "LinkedIn URL",
    "Resume (PDF only)",
    "What is your salary expectation?", // distinct from "what motivates"
    "Years of experience",
    "Cover letter",
    "",
    "   ",
  ];

  for (const sample of negatives) {
    it(`rejects: "${sample}"`, () => {
      expect(LABEL_MATCH_REGEX.test(sample)).toBe(false);
    });
  }
});

describe("extractTextareaLabel", () => {
  it("prefers aria-label when present", () => {
    document.body.innerHTML = `
      <label for="t1">Visible label</label>
      <textarea id="t1" aria-label="Tell us about yourself"></textarea>
    `;
    const ta = document.getElementById("t1") as HTMLTextAreaElement;
    expect(extractTextareaLabel(ta)).toBe("Tell us about yourself");
  });

  it("falls back to aria-labelledby joined by spaces", () => {
    document.body.innerHTML = `
      <span id="lbl-a">Why are you interested</span>
      <span id="lbl-b">in this role?</span>
      <textarea aria-labelledby="lbl-a lbl-b"></textarea>
    `;
    const ta = document.querySelector("textarea") as HTMLTextAreaElement;
    expect(extractTextareaLabel(ta)).toBe(
      "Why are you interested in this role?",
    );
  });

  it("falls back to label[for=...] match", () => {
    document.body.innerHTML = `
      <label for="t2">Describe a time you failed</label>
      <textarea id="t2"></textarea>
    `;
    const ta = document.getElementById("t2") as HTMLTextAreaElement;
    expect(extractTextareaLabel(ta)).toBe("Describe a time you failed");
  });

  it("falls back to ancestor <label>", () => {
    document.body.innerHTML = `
      <label>What motivates you?<textarea></textarea></label>
    `;
    const ta = document.querySelector("textarea") as HTMLTextAreaElement;
    expect(extractTextareaLabel(ta)).toBe("What motivates you?");
  });

  it("falls back to placeholder if no label is available", () => {
    document.body.innerHTML = `
      <textarea placeholder="Tell us about your background"></textarea>
    `;
    const ta = document.querySelector("textarea") as HTMLTextAreaElement;
    expect(extractTextareaLabel(ta)).toBe("Tell us about your background");
  });

  it("returns empty string when no signal is available", () => {
    document.body.innerHTML = `<textarea></textarea>`;
    const ta = document.querySelector("textarea") as HTMLTextAreaElement;
    expect(extractTextareaLabel(ta)).toBe("");
  });
});

describe("shouldDecorateTextarea", () => {
  function makeTextarea(opts: {
    label?: string;
    placeholder?: string;
    maxlength?: number | "none";
    disabled?: boolean;
    readonly?: boolean;
    ariaHidden?: boolean;
  }): HTMLTextAreaElement {
    const wrapper = document.createElement("div");
    if (opts.label) {
      const label = document.createElement("label");
      label.htmlFor = "tt";
      label.textContent = opts.label;
      wrapper.appendChild(label);
    }
    const ta = document.createElement("textarea");
    ta.id = "tt";
    if (opts.placeholder) ta.placeholder = opts.placeholder;
    if (opts.maxlength === undefined) {
      ta.setAttribute("maxlength", "1000");
    } else if (opts.maxlength !== "none") {
      ta.setAttribute("maxlength", String(opts.maxlength));
    }
    if (opts.disabled) ta.disabled = true;
    if (opts.readonly) ta.readOnly = true;
    if (opts.ariaHidden) ta.setAttribute("aria-hidden", "true");
    wrapper.appendChild(ta);
    document.body.appendChild(wrapper);
    return ta;
  }

  it("decorates a long textarea with a matching label", () => {
    const ta = makeTextarea({
      label: "Tell us about a time you led a team",
      maxlength: 2000,
    });
    expect(shouldDecorateTextarea(ta)).toBe(true);
  });

  it("decorates a textarea with no maxlength but a matching label", () => {
    const ta = makeTextarea({
      label: "Why this company?",
      maxlength: "none",
    });
    expect(shouldDecorateTextarea(ta)).toBe(true);
  });

  it(`rejects a textarea with maxlength <= ${LONG_TEXTAREA_MIN_MAXLENGTH}`, () => {
    const ta = makeTextarea({
      label: "Tell us about yourself",
      maxlength: 200,
    });
    expect(shouldDecorateTextarea(ta)).toBe(false);
  });

  it(`rejects a textarea with maxlength exactly at the floor (${LONG_TEXTAREA_MIN_MAXLENGTH})`, () => {
    const ta = makeTextarea({
      label: "Tell us about yourself",
      maxlength: LONG_TEXTAREA_MIN_MAXLENGTH,
    });
    expect(shouldDecorateTextarea(ta)).toBe(false);
  });

  it("rejects a long textarea with a non-essay label", () => {
    const ta = makeTextarea({
      label: "Additional comments",
      maxlength: 2000,
    });
    expect(shouldDecorateTextarea(ta)).toBe(false);
  });

  it("rejects a textarea with no label at all", () => {
    const ta = makeTextarea({ maxlength: 2000 });
    expect(shouldDecorateTextarea(ta)).toBe(false);
  });

  it("rejects a disabled textarea", () => {
    const ta = makeTextarea({
      label: "Tell us about yourself",
      maxlength: 2000,
      disabled: true,
    });
    expect(shouldDecorateTextarea(ta)).toBe(false);
  });

  it("rejects a readonly textarea", () => {
    const ta = makeTextarea({
      label: "Tell us about yourself",
      maxlength: 2000,
      readonly: true,
    });
    expect(shouldDecorateTextarea(ta)).toBe(false);
  });

  it("rejects an aria-hidden textarea", () => {
    const ta = makeTextarea({
      label: "Tell us about yourself",
      maxlength: 2000,
      ariaHidden: true,
    });
    expect(shouldDecorateTextarea(ta)).toBe(false);
  });

  it("accepts placeholder-only labelling when it matches", () => {
    const ta = makeTextarea({
      placeholder: "Tell us about your proudest achievement",
      maxlength: 2000,
    });
    expect(shouldDecorateTextarea(ta)).toBe(true);
  });
});

describe("truncate", () => {
  it("returns the input unchanged when shorter than max", () => {
    expect(truncate("short answer", 80)).toBe("short answer");
  });

  it("clips and appends ellipsis when longer than max", () => {
    const long = "a".repeat(120);
    const out = truncate(long, 80);
    expect(out.endsWith("…")).toBe(true);
    expect(out.length).toBeLessThanOrEqual(81);
  });

  it("trims trailing whitespace before the ellipsis", () => {
    const input = `${"x".repeat(78)}  trailing`;
    const out = truncate(input, 80);
    expect(out).not.toContain("  …");
    expect(out.endsWith("…")).toBe(true);
  });
});
