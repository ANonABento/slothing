// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import type { DetectedField } from "@/shared/types";
import { AutoFillEngine } from "./engine";

function field(
  element: DetectedField["element"],
  fieldType: DetectedField["fieldType"] = "firstName",
): DetectedField {
  return {
    element,
    fieldType,
    confidence: 1,
    label: "First name",
  };
}

function engineFor(value: string) {
  return new AutoFillEngine(
    {} as never,
    {
      mapFieldToValue: () => value,
    } as never,
  );
}

function customQuestionEngine() {
  return new AutoFillEngine(
    {} as never,
    { mapFieldToValue: () => null } as never,
  );
}

function customQuestionField(element: DetectedField["element"]): DetectedField {
  return {
    element,
    fieldType: "customQuestion",
    confidence: 0.2,
    label: "Why do you want to work here?",
  };
}

describe("AutoFillEngine custom-question answer bank", () => {
  it("fills an empty custom question from a high-similarity match", async () => {
    document.body.innerHTML = `<textarea id="q"></textarea>`;
    const ta = document.querySelector<HTMLTextAreaElement>("#q")!;
    const resolveCustomAnswer = vi.fn().mockResolvedValue({
      answer: "Your mission resonates with me.",
      similarity: 0.9,
    });

    const result = await customQuestionEngine().fillForm(
      [customQuestionField(ta)],
      { resolveCustomAnswer },
    );

    expect(resolveCustomAnswer).toHaveBeenCalledWith(
      "Why do you want to work here?",
    );
    expect(ta.value).toBe("Your mission resonates with me.");
    expect(result.filled).toBe(1);
    expect(result.fromAnswerBank).toBe(1);
    expect(result.yellow).toBe(1); // review marker applied
  });

  it("offers a medium-similarity match as a cold pick instead of filling", async () => {
    document.body.innerHTML = `<div><textarea id="q"></textarea></div>`;
    const ta = document.querySelector<HTMLTextAreaElement>("#q")!;
    const resolveCustomAnswer = vi
      .fn()
      .mockResolvedValue({ answer: "Maybe relevant.", similarity: 0.65 });

    const result = await customQuestionEngine().fillForm(
      [customQuestionField(ta)],
      { resolveCustomAnswer },
    );

    expect(ta.value).toBe("");
    expect(result.filled).toBe(0);
    expect(result.cold).toBe(1);
  });

  it("skips when there is no usable match", async () => {
    document.body.innerHTML = `<textarea id="q"></textarea>`;
    const ta = document.querySelector<HTMLTextAreaElement>("#q")!;
    const resolveCustomAnswer = vi.fn().mockResolvedValue(null);

    const result = await customQuestionEngine().fillForm(
      [customQuestionField(ta)],
      { resolveCustomAnswer },
    );

    expect(ta.value).toBe("");
    expect(result.filled).toBe(0);
    expect(result.fromAnswerBank).toBe(0);
  });

  it("never overwrites an answer the user already typed", async () => {
    document.body.innerHTML = `<textarea id="q">My own answer</textarea>`;
    const ta = document.querySelector<HTMLTextAreaElement>("#q")!;
    const resolveCustomAnswer = vi.fn().mockResolvedValue({
      answer: "Bank answer",
      similarity: 0.95,
    });

    const result = await customQuestionEngine().fillForm(
      [customQuestionField(ta)],
      { resolveCustomAnswer },
    );

    expect(resolveCustomAnswer).not.toHaveBeenCalled();
    expect(ta.value).toBe("My own answer");
    expect(result.filled).toBe(0);
  });
});

describe("AutoFillEngine overwrite safety", () => {
  it("fills empty text inputs", async () => {
    document.body.innerHTML = `<input id="firstName" />`;
    const input = document.querySelector<HTMLInputElement>("#firstName")!;

    const result = await engineFor("Riley").fillForm([field(input)]);

    expect(input.value).toBe("Riley");
    expect(result.filled).toBe(1);
    expect(result.conflicts).toBe(0);
  });

  it("does not clear a non-empty text input by default", async () => {
    document.body.innerHTML = `<input id="firstName" value="Alex" />`;
    const input = document.querySelector<HTMLInputElement>("#firstName")!;
    const onFilled = vi.fn();

    const result = await engineFor("Riley").fillForm([field(input)], {
      onFilled,
    });

    expect(input.value).toBe("Alex");
    expect(result.filled).toBe(0);
    expect(result.conflicts).toBe(1);
    expect(result.details[0]?.conflict).toMatchObject({
      currentValue: "Alex",
      suggestedValue: "Riley",
    });
    expect(onFilled).not.toHaveBeenCalled();
  });

  it("overwrites a non-empty text input only when requested", async () => {
    document.body.innerHTML = `<input id="firstName" value="Alex" />`;
    const input = document.querySelector<HTMLInputElement>("#firstName")!;

    const result = await engineFor("Riley").fillForm([field(input)], {
      overwriteExisting: true,
    });

    expect(input.value).toBe("Riley");
    expect(result.filled).toBe(1);
    expect(result.details[0]?.overwritten).toBe(true);
  });

  it("counts exact existing matches as already filled without rewriting", async () => {
    document.body.innerHTML = `<input id="firstName" value="Riley" />`;
    const input = document.querySelector<HTMLInputElement>("#firstName")!;
    const onFilled = vi.fn();

    const result = await engineFor("Riley").fillForm([field(input)], {
      onFilled,
    });

    expect(result.alreadyFilled).toBe(1);
    expect(result.conflicts).toBe(0);
    expect(onFilled).not.toHaveBeenCalled();
  });

  it("preserves existing select values by default", async () => {
    document.body.innerHTML = `
      <select id="country">
        <option value="">Select...</option>
        <option value="US" selected>United States</option>
        <option value="CA">Canada</option>
      </select>
    `;
    const select = document.querySelector<HTMLSelectElement>("#country")!;

    const result = await engineFor("Canada").fillForm([
      field(select, "country"),
    ]);

    expect(select.value).toBe("US");
    expect(result.conflicts).toBe(1);
  });

  it("preserves existing radio choices by default", async () => {
    document.body.innerHTML = `
      <label><input type="radio" name="workAuth" value="yes" checked /> Yes</label>
      <label><input type="radio" name="workAuth" value="no" /> No</label>
    `;
    const first = document.querySelector<HTMLInputElement>(
      'input[name="workAuth"]',
    )!;

    const result = await engineFor("no").fillForm([
      field(first, "workAuthorization"),
    ]);

    expect(
      document.querySelector<HTMLInputElement>(
        'input[name="workAuth"][value="yes"]',
      )?.checked,
    ).toBe(true);
    expect(result.conflicts).toBe(1);
  });
});
