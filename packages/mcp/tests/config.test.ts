import { describe, expect, it } from "vitest";
import { loadConfig, ConfigError } from "../src/config.js";

describe("loadConfig", () => {
  it("reads SLOTHING_TOKEN + SLOTHING_API_URL", () => {
    const config = loadConfig({
      SLOTHING_TOKEN: "tok",
      SLOTHING_API_URL: "http://localhost:3000",
    } as NodeJS.ProcessEnv);
    expect(config).toEqual({ baseUrl: "http://localhost:3000", token: "tok" });
  });

  it("accepts legacy SLOTHING_EXTENSION_TOKEN + SLOTHING_BASE_URL aliases", () => {
    const config = loadConfig({
      SLOTHING_EXTENSION_TOKEN: "legacy",
      SLOTHING_BASE_URL: "https://slothing.work",
    } as NodeJS.ProcessEnv);
    expect(config).toEqual({
      baseUrl: "https://slothing.work",
      token: "legacy",
    });
  });

  it("trims whitespace on both fields", () => {
    const config = loadConfig({
      SLOTHING_TOKEN: "  tok  ",
      SLOTHING_API_URL: "  http://localhost:3000  ",
    } as NodeJS.ProcessEnv);
    expect(config).toEqual({ baseUrl: "http://localhost:3000", token: "tok" });
  });

  it("throws ConfigError when token is missing", () => {
    expect(() =>
      loadConfig({ SLOTHING_API_URL: "x" } as NodeJS.ProcessEnv),
    ).toThrow(ConfigError);
  });

  it("throws ConfigError when base URL is missing", () => {
    expect(() =>
      loadConfig({ SLOTHING_TOKEN: "x" } as NodeJS.ProcessEnv),
    ).toThrow(ConfigError);
  });

  it("lists both missing vars in the error message", () => {
    try {
      loadConfig({} as NodeJS.ProcessEnv);
      throw new Error("expected ConfigError to be thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigError);
      const message = (err as Error).message;
      expect(message).toContain("SLOTHING_TOKEN");
      expect(message).toContain("SLOTHING_API_URL");
    }
  });
});
