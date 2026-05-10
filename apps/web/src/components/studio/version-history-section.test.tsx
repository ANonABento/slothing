import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BuilderVersion } from "@/lib/builder/version-history";
import { VersionHistorySection } from "./version-history-section";

const version: BuilderVersion = {
  id: "version-1",
  kind: "manual",
  name: "Initial draft",
  savedAt: "2026-04-29T12:00:00.000Z",
  state: {
    documentMode: "resume",
    selectedIds: [],
    sections: [],
    templateId: "classic",
    html: "",
  },
};

describe("VersionHistorySection", () => {
  it("uses theme variable classes for version controls", () => {
    render(
      <VersionHistorySection
        versions={[version]}
        previewVersionId="version-1"
        manualVersionName=""
        onCompareVersion={vi.fn()}
        onPreviewVersion={vi.fn()}
        onManualVersionNameChange={vi.fn()}
        onSaveVersion={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Initial draft").parentElement?.className,
    ).toContain("rounded-[var(--radius)]");
    expect(screen.getByPlaceholderText("Version name...").className).toContain(
      "border-[length:var(--border-width)]",
    );
  });

  it("gives the manual version-name input an accessible name", () => {
    render(
      <VersionHistorySection
        versions={[version]}
        previewVersionId="version-1"
        manualVersionName=""
        onCompareVersion={vi.fn()}
        onPreviewVersion={vi.fn()}
        onManualVersionNameChange={vi.fn()}
        onSaveVersion={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("textbox", { name: "Version name" }),
    ).toBeInTheDocument();
  });

  it("calls compare without previewing the version", () => {
    const onCompareVersion = vi.fn();
    const onPreviewVersion = vi.fn();

    render(
      <VersionHistorySection
        versions={[version]}
        previewVersionId={null}
        manualVersionName=""
        onCompareVersion={onCompareVersion}
        onPreviewVersion={onPreviewVersion}
        onManualVersionNameChange={vi.fn()}
        onSaveVersion={vi.fn()}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Compare Initial draft to current",
      }),
    );

    expect(onCompareVersion).toHaveBeenCalledWith("version-1");
    expect(onPreviewVersion).not.toHaveBeenCalled();
  });
});
