import { describe, expect, it } from "vitest";
import {
  buildFullImportMessage,
  buildImportPreviewStats,
  getExportFileName,
  getExportUrl,
} from "./use-data-io";

describe("getExportFileName", () => {
  const date = new Date("2026-04-24T12:00:00.000Z");

  it("uses the slothing filenames for all exports", () => {
    expect(getExportFileName("profile", date)).toBe(
      "slothing-profile-2026-04-24.json",
    );
    expect(getExportFileName("jobs-json", date)).toBe(
      "slothing-opportunities-2026-04-24.json",
    );
    expect(getExportFileName("jobs-csv", date)).toBe(
      "slothing-opportunities-2026-04-24.csv",
    );
    expect(getExportFileName("backup", date)).toBe(
      "slothing-backup-2026-04-24.json",
    );
  });

  it("uses the slothing full export filename", () => {
    expect(getExportFileName("full-export", date)).toBe(
      "slothing-export-2026-04-24.json",
    );
  });
});

describe("getExportUrl", () => {
  it("uses the opportunities API for opportunities exports", () => {
    expect(getExportUrl("jobs-json")).toBe(
      "/api/export/opportunities?format=json",
    );
    expect(getExportUrl("jobs-csv")).toBe(
      "/api/export/opportunities?format=csv",
    );
  });
});

describe("buildImportPreviewStats", () => {
  it("summarizes every supported section", () => {
    expect(
      buildImportPreviewStats({
        version: "1",
        data: {
          profile: {},
          jobs: [{}, {}],
          coverLetters: [{}],
          bankEntries: [{}, {}, {}],
          generatedResumes: [{}],
          interviewSessions: [{}, {}],
          llmConfig: {},
        },
      }),
    ).toEqual({
      Profile: 1,
      Opportunities: 2,
      "Cover Letters": 1,
      "Bank Entries": 3,
      "Generated Resumes": 1,
      "Interview Sessions": 2,
      "LLM Config": 1,
    });
  });
});

describe("buildFullImportMessage", () => {
  it("lists only the imported sections", () => {
    expect(
      buildFullImportMessage({
        results: {
          profile: true,
          jobs: { imported: 2 },
          coverLetters: { imported: 1 },
          bankEntries: { imported: 0 },
          llmConfig: true,
        },
      }),
    ).toBe("Imported: Profile, 2 opportunities, 1 cover letters, LLM config");
  });

  it("returns the duplicate-skipped message when nothing new was added", () => {
    expect(
      buildFullImportMessage({
        results: {
          jobs: { imported: 0 },
        },
      }),
    ).toBe("No new data to import (all duplicates skipped)");
  });
});
