import { describe, expect, it } from "vitest";

import { locales } from "@/i18n";
import { localeDir } from "./dir";

describe("localeDir", () => {
  it("returns ltr for every supported locale", () => {
    for (const locale of locales) {
      expect(localeDir(locale)).toBe("ltr");
    }
  });
});
