import { afterEach, describe, expect, it, vi } from "vitest";
import { log, safeBasenameHash } from "./log";

describe("log", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("hashes filename fields instead of writing long filenames verbatim", () => {
    const debugSpy = vi
      .spyOn(console, "debug")
      .mockImplementation(() => undefined);
    const rawFilename = "Jane_Doe_Private_Resume_2026_Confidential_Fina.pdf";

    log.debug("upload", "file received", { filename: rawFilename });

    const output = debugSpy.mock.calls
      .map((args) =>
        args
          .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
          .join(" "),
      )
      .join("\n");

    expect(rawFilename).toHaveLength(50);
    expect(output).not.toContain(rawFilename);
    expect(output).toContain(safeBasenameHash(rawFilename));
    expect(debugSpy).toHaveBeenCalledWith("[upload] file received", {
      filenameHash: safeBasenameHash(rawFilename),
    });
  });
});
