import { describe, expect, it } from "vitest";
import {
  DEFAULT_PAGE_SETTINGS,
  normalizePageSettings,
  pageSettingsToPrintCss,
} from "./page-settings";

describe("normalizePageSettings", () => {
  it("defaults older documents to letter with normal margins", () => {
    expect(normalizePageSettings(undefined)).toEqual(DEFAULT_PAGE_SETTINGS);
  });

  it("applies preset margins consistently", () => {
    expect(
      normalizePageSettings({ size: "a4", marginPreset: "narrow" }).margins,
    ).toEqual({
      top: 0.5,
      right: 0.5,
      bottom: 0.5,
      left: 0.5,
    });
  });

  it("clamps custom margins for stable preview and PDF output", () => {
    expect(
      normalizePageSettings({
        size: "letter",
        marginPreset: "custom",
        margins: { top: -1, right: 0.25, bottom: 3, left: 1.1 },
      }).margins,
    ).toEqual({
      top: 0,
      right: 0.25,
      bottom: 2,
      left: 1.1,
    });
  });
});

describe("pageSettingsToPrintCss", () => {
  it("renders CSS page size and margins", () => {
    expect(
      pageSettingsToPrintCss({
        size: "a4",
        marginPreset: "custom",
        margins: { top: 0.5, right: 0.75, bottom: 0.5, left: 0.75 },
      }),
    ).toBe("@page { size: A4; margin: 0.5in 0.75in 0.5in 0.75in; }");
  });
});
