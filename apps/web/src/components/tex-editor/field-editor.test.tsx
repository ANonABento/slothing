import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { FieldDescriptor } from "@/lib/latex/document-model";

import { FieldEditor } from "./field-editor";

const PLAIN: FieldDescriptor = {
  index: 0,
  label: "Text",
  raw: String.raw`Cut cost 40\% in Q3`,
  mode: "plain",
  display: "Cut cost 40% in Q3",
};

const RICH: FieldDescriptor = {
  index: 0,
  label: "Text",
  raw: String.raw`Shipped \slothingB{real-time} telemetry`,
  mode: "rich",
  display: String.raw`Shipped \slothingB{real-time} telemetry`,
};

function renderField(field: FieldDescriptor, overrides = {}) {
  const onChange = vi.fn(() => true);
  const onCommit = vi.fn();
  render(
    <FieldEditor
      spanId="itm-000001"
      field={field}
      violations={[]}
      onChange={onChange}
      onCommit={onCommit}
      {...overrides}
    />,
  );
  return { onChange, onCommit };
}

describe("plain fields", () => {
  it("shows readable text, not escaped LaTeX", () => {
    renderField(PLAIN);
    expect(screen.getByRole("textbox")).toHaveValue("Cut cost 40% in Q3");
  });

  it("writes as plain text so the value gets re-escaped", () => {
    const { onChange } = renderField(PLAIN);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Saved $2M" },
    });
    expect(onChange).toHaveBeenCalledWith({ kind: "plain", text: "Saved $2M" });
  });

  it("commits on blur — the save boundary, not every keystroke", () => {
    const { onCommit } = renderField(PLAIN);
    fireEvent.blur(screen.getByRole("textbox"));
    expect(onCommit).toHaveBeenCalledTimes(1);
  });

  it("offers no formatting controls", () => {
    renderField(PLAIN);
    expect(screen.queryByText(/Edit as LaTeX/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Contains formatting/i)).not.toBeInTheDocument();
  });
});

describe("rich fields", () => {
  it("shows the stored LaTeX, never the lossy plain projection", () => {
    renderField(RICH);
    // Critical: showing "Shipped real-time telemetry" here would invite an edit that
    // silently drops the bold.
    expect(screen.getByRole("textbox")).toHaveValue(RICH.raw);
  });

  it("flags that the field carries formatting", () => {
    renderField(RICH);
    expect(screen.getByText(/Contains formatting/i)).toBeInTheDocument();
  });

  it("is read-only until the user explicitly opts into LaTeX editing", () => {
    const { onChange } = renderField(RICH);
    const textbox = screen.getByRole("textbox");
    expect(textbox).toHaveAttribute("readonly");

    fireEvent.change(textbox, { target: { value: "anything" } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("writes as LaTeX once raw editing is enabled", () => {
    const { onChange } = renderField(RICH);
    fireEvent.click(screen.getByRole("button", { name: /Edit as LaTeX/i }));

    const textbox = screen.getByRole("textbox");
    expect(textbox).not.toHaveAttribute("readonly");
    fireEvent.change(textbox, { target: { value: String.raw`\slothingI{x}` } });
    expect(onChange).toHaveBeenCalledWith({
      kind: "latex",
      latex: String.raw`\slothingI{x}`,
    });
  });

  it("gates flattening behind a confirmation — it destroys formatting", () => {
    const { onChange } = renderField(RICH);
    fireEvent.click(screen.getByRole("button", { name: /Remove formatting/i }));
    // The confirm dialog opens; nothing is written until it is accepted.
    expect(onChange).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Remove formatting from this field\?/i),
    ).toBeInTheDocument();
  });
});

describe("violations", () => {
  it("explains what is wrong in words, not error codes", () => {
    renderField(RICH, {
      violations: [{ kind: "disallowed-macro", macro: "input", index: 0 }],
    });
    expect(screen.getByRole("alert")).toHaveTextContent(
      /\\input is not allowed/i,
    );
  });

  it("reports an unsafe link scheme", () => {
    renderField(RICH, {
      violations: [{ kind: "unsafe-url", url: "javascript:alert(1)" }],
    });
    expect(screen.getByRole("alert")).toHaveTextContent(/http\(s\) or mailto/i);
  });
});
