// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import {
  fillAnswersInScope,
  fillField,
  findFieldByLabel,
  normalizeLabel,
} from "./field-match";

function form(html: string): HTMLFormElement {
  document.body.innerHTML = `<form>${html}</form>`;
  return document.querySelector("form")!;
}

describe("normalizeLabel", () => {
  it("lowercases, collapses whitespace, strips * and :", () => {
    expect(normalizeLabel("  Why  this  Company? *")).toBe("why this company?");
    expect(normalizeLabel("Years of Go:")).toBe("years of go");
  });
});

describe("findFieldByLabel", () => {
  it("matches via an explicit <label for>", () => {
    const root = form(`
      <label for="a">Why this company?</label>
      <textarea id="a"></textarea>
    `);
    const el = findFieldByLabel(root, "Why this company? *");
    expect(el?.tagName.toLowerCase()).toBe("textarea");
  });

  it("matches via aria-label and placeholder", () => {
    const root = form(`
      <input id="x" aria-label="Years of Go" />
      <input id="y" placeholder="LinkedIn URL" />
    `);
    expect(findFieldByLabel(root, "years of go")?.getAttribute("id")).toBe("x");
    expect(findFieldByLabel(root, "LinkedIn URL")?.getAttribute("id")).toBe(
      "y",
    );
  });

  it("falls back to a contains match", () => {
    const root = form(
      `<label for="a">What is your expected salary range</label><input id="a" />`,
    );
    expect(findFieldByLabel(root, "expected salary")?.getAttribute("id")).toBe(
      "a",
    );
  });

  it("prefers the most specific field over a bare name-attribute token", () => {
    const root = form(`
      <input id="generic" name="name" />
      <label for="fn">Your first name</label><input id="fn" />
    `);
    // "First name" must land on the labelled field, not the generic name="name".
    expect(findFieldByLabel(root, "First name")?.getAttribute("id")).toBe("fn");
  });

  it("ignores submit/hidden inputs", () => {
    const root = form(
      `<input type="submit" aria-label="go" /><input type="hidden" aria-label="go" />`,
    );
    expect(findFieldByLabel(root, "go")).toBeNull();
  });
});

describe("fillField", () => {
  it("writes text inputs and dispatches input/change", () => {
    const root = form(`<input id="a" aria-label="name" />`);
    const el = root.querySelector("input")!;
    let changed = false;
    el.addEventListener("change", () => (changed = true));
    expect(fillField(el, "Ada")).toBe(true);
    expect(el.value).toBe("Ada");
    expect(changed).toBe(true);
  });

  it("selects a matching option by text or value", () => {
    const root = form(
      `<select id="a"><option value="">—</option><option value="yes">Yes</option></select>`,
    );
    const el = root.querySelector("select")!;
    expect(fillField(el, "Yes")).toBe(true);
    expect(el.value).toBe("yes");
  });

  it("checks a checkbox for truthy values", () => {
    const root = form(`<input type="checkbox" id="a" aria-label="agree" />`);
    const el = root.querySelector("input")!;
    expect(fillField(el, "yes")).toBe(true);
    expect(el.checked).toBe(true);
  });
});

describe("fillAnswersInScope", () => {
  it("fills matched answers and counts them", () => {
    const root = form(`
      <label for="q1">Why us?</label><textarea id="q1"></textarea>
      <label for="q2">Years of Go</label><input id="q2" />
    `);
    const filled = fillAnswersInScope(root, [
      { questionId: "1", label: "Why us?", value: "Mission" },
      { questionId: "2", label: "Years of Go", value: "6" },
      { questionId: "3", label: "Unmatched question", value: "x" },
    ]);
    expect(filled).toBe(2);
    expect((root.querySelector("#q1") as HTMLTextAreaElement).value).toBe(
      "Mission",
    );
  });
});
