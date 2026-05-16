import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  BODY_FONTS,
  DEFAULT_EDITORIAL_PREFS,
  DISPLAY_FONTS,
  EDITORIAL_PREFS_STORAGE_KEY,
  EditorialPrefsProvider,
  isBodyFontId,
  isDisplayFontId,
  parseEditorialPrefs,
  useEditorialPrefs,
  type BodyFontId,
  type DisplayFontId,
} from ".";

function Probe({
  onReady,
}: {
  onReady: (api: ReturnType<typeof useEditorialPrefs>) => void;
}) {
  const api = useEditorialPrefs();
  onReady(api);
  return null;
}

describe("editorial-prefs body font preset", () => {
  beforeEach(() => {
    vi.mocked(window.localStorage.getItem).mockReturnValue(null);
    vi.mocked(window.localStorage.setItem).mockClear();
    document.documentElement.removeAttribute("data-body");
    document.documentElement.removeAttribute("data-display");
  });

  it("defaults to Geist for a fresh user", () => {
    expect(DEFAULT_EDITORIAL_PREFS.body).toBe("geist");
  });

  it("ships eight body-font presets including system + Geist", () => {
    const ids = BODY_FONTS.map((b) => b.id);
    expect(ids).toEqual([
      "geist",
      "inter",
      "plex",
      "atkinson",
      "source",
      "dm",
      "jakarta",
      "system",
    ]);
  });

  it("validates body ids via isBodyFontId", () => {
    expect(isBodyFontId("geist")).toBe(true);
    expect(isBodyFontId("inter")).toBe(true);
    expect(isBodyFontId("system")).toBe(true);
    expect(isBodyFontId("nope")).toBe(false);
    expect(isBodyFontId(undefined)).toBe(false);
  });

  it("parses an unknown body value back to the default", () => {
    const parsed = parseEditorialPrefs({ body: "comic-sans" });
    expect(parsed.body).toBe("geist");
  });

  it("parses a valid body value and keeps it", () => {
    const parsed = parseEditorialPrefs({ body: "atkinson" });
    expect(parsed.body).toBe("atkinson");
  });

  it("writes data-body to <html> on mount", () => {
    let api: ReturnType<typeof useEditorialPrefs> | null = null;
    render(
      <EditorialPrefsProvider>
        <Probe onReady={(value) => (api = value)} />
      </EditorialPrefsProvider>,
    );
    expect(document.documentElement.getAttribute("data-body")).toBe("geist");
    expect(api).not.toBeNull();
  });

  it("persists body to localStorage and updates data-body on change", () => {
    let api: ReturnType<typeof useEditorialPrefs> | null = null;
    render(
      <EditorialPrefsProvider>
        <Probe onReady={(value) => (api = value)} />
      </EditorialPrefsProvider>,
    );

    act(() => {
      api!.setPref("body", "plex");
    });

    expect(document.documentElement.getAttribute("data-body")).toBe("plex");

    // Last setItem call must be a prefs blob with body=plex
    const calls = vi.mocked(window.localStorage.setItem).mock.calls;
    const prefsWrites = calls.filter(
      ([key]) => key === EDITORIAL_PREFS_STORAGE_KEY,
    );
    expect(prefsWrites.length).toBeGreaterThan(0);
    const last = prefsWrites[prefsWrites.length - 1]![1];
    expect(JSON.parse(last)).toMatchObject({ body: "plex" });
  });

  it("rehydrates body preset from localStorage on mount", () => {
    vi.mocked(window.localStorage.getItem).mockImplementation((key) => {
      if (key === EDITORIAL_PREFS_STORAGE_KEY) {
        return JSON.stringify({
          ...DEFAULT_EDITORIAL_PREFS,
          body: "atkinson",
        });
      }
      return null;
    });

    render(
      <EditorialPrefsProvider>
        <Probe onReady={() => {}} />
      </EditorialPrefsProvider>,
    );

    expect(document.documentElement.getAttribute("data-body")).toBe("atkinson");
  });

  it("each body preset exposes a previewFamily for in-place rendering", () => {
    for (const font of BODY_FONTS) {
      expect(typeof font.previewFamily).toBe("string");
      expect(font.previewFamily.length).toBeGreaterThan(0);
    }
  });
});

describe("editorial-prefs display font preset (regression guard)", () => {
  beforeEach(() => {
    vi.mocked(window.localStorage.getItem).mockReturnValue(null);
    vi.mocked(window.localStorage.setItem).mockClear();
    document.documentElement.removeAttribute("data-display");
  });

  it("defaults to outfit", () => {
    expect(DEFAULT_EDITORIAL_PREFS.display).toBe("outfit");
  });

  it("validates display ids", () => {
    for (const font of DISPLAY_FONTS) {
      expect(isDisplayFontId(font.id)).toBe(true);
    }
    expect(isDisplayFontId("nope")).toBe(false);
  });

  it("writes and persists display font", () => {
    let api: ReturnType<typeof useEditorialPrefs> | null = null;
    render(
      <EditorialPrefsProvider>
        <Probe onReady={(value) => (api = value)} />
      </EditorialPrefsProvider>,
    );

    act(() => {
      api!.setPref("display", "jakarta" as DisplayFontId);
    });

    expect(document.documentElement.getAttribute("data-display")).toBe(
      "jakarta",
    );
  });

  it("body and display are independent presets", () => {
    let api: ReturnType<typeof useEditorialPrefs> | null = null;
    render(
      <EditorialPrefsProvider>
        <Probe onReady={(value) => (api = value)} />
      </EditorialPrefsProvider>,
    );

    act(() => {
      api!.setPref("display", "space" as DisplayFontId);
      api!.setPref("body", "atkinson" as BodyFontId);
    });

    expect(document.documentElement.getAttribute("data-display")).toBe("space");
    expect(document.documentElement.getAttribute("data-body")).toBe("atkinson");
  });
});
