import { isValidElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { OG_BRAND, OG_SIZE } from "./config";
import { renderOgImage } from "./template";

vi.mock("next/og", () => ({
  ImageResponse: vi.fn(function ImageResponse(element, options) {
    return { element, options };
  }),
}));

function collectText(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(collectText).join(" ");
  }

  if (isValidElement<{ children?: unknown }>(node)) {
    return collectText(node.props.children);
  }

  return "";
}

function collectStyleValues(node: unknown): string[] {
  if (node === null || node === undefined || typeof node === "boolean") {
    return [];
  }

  if (Array.isArray(node)) {
    return node.flatMap(collectStyleValues);
  }

  if (
    isValidElement<{ children?: unknown; style?: Record<string, unknown> }>(
      node,
    )
  ) {
    return [
      ...Object.values(node.props.style ?? {}).map(String),
      ...collectStyleValues(node.props.children),
    ];
  }

  return [];
}

describe("renderOgImage", () => {
  it("returns an ImageResponse configured for the OG dimensions", () => {
    const response = renderOgImage({
      title: "Dashboard",
      description: "Track your job search progress.",
    }) as unknown as { options: typeof OG_SIZE };

    expect(response.options).toEqual(OG_SIZE);
  });

  it("embeds the title, description, and Slothing wordmark", () => {
    const response = renderOgImage({
      title: "Document Studio",
      description: "Build application-ready resumes.",
    }) as unknown as { element: unknown };
    const text = collectText(response.element);

    expect(text).toContain("Document Studio");
    expect(text).toContain("Build application-ready resumes.");
    expect(text).toContain("Slothing");
  });

  it("uses the brand color values", () => {
    const response = renderOgImage({
      title: "Analytics",
      description: "Visualize your job search metrics.",
    }) as unknown as { element: unknown };
    const styleValues = collectStyleValues(response.element).join(" ");

    expect(styleValues).toContain(OG_BRAND.primary);
    expect(styleValues).toContain(OG_BRAND.primaryDark);
  });

  it("handles missing and long descriptions", () => {
    expect(() => renderOgImage({ title: "Settings" })).not.toThrow();
    expect(() =>
      renderOgImage({
        title: "Settings",
        description: "Configure ".repeat(40),
      }),
    ).not.toThrow();
  });
});
