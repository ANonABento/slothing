import { describe, expect, it, vi } from "vitest";
import {
  createStudioDocument,
  deleteStudioDocument,
  ensureStudioDocuments,
  getActiveStudioDocument,
  getDefaultStudioContent,
  getDocumentsForType,
  getStudioModeFromSearchParam,
  getStudioModeHref,
  isStudioDocumentMode,
  loadStudioDocuments,
  parseStudioDocuments,
  renameStudioDocument,
  saveStudioDocuments,
  STUDIO_DOCUMENT_STORAGE_KEY,
  updateStudioDocument,
} from "./document-studio";

const now = "2026-04-26T12:00:00.000Z";

describe("document studio helpers", () => {
  it("validates the two studio document modes", () => {
    expect(isStudioDocumentMode("resume")).toBe(true);
    expect(isStudioDocumentMode("cover-letter")).toBe(true);
    expect(isStudioDocumentMode("tailored")).toBe(false);
    expect(isStudioDocumentMode("portfolio")).toBe(false);
  });

  it("reads the studio mode from the URL search param", () => {
    expect(getStudioModeFromSearchParam("cover-letter")).toBe("cover-letter");
    expect(getStudioModeFromSearchParam("tailored")).toBe("resume");
    expect(getStudioModeFromSearchParam("portfolio")).toBe("resume");
    expect(getStudioModeFromSearchParam(null)).toBe("resume");
  });

  it("builds studio mode hrefs", () => {
    expect(getStudioModeHref("resume")).toBe("/studio");
    expect(getStudioModeHref("cover-letter")).toBe("/studio?mode=cover-letter");
  });

  it("returns blank starter content", () => {
    expect(getDefaultStudioContent("resume")).toBe("");
    expect(getDefaultStudioContent("cover-letter")).toBe("");
  });

  it("creates blank documents with persisted builder fields", () => {
    const document = createStudioDocument("resume", {
      id: "resume-1",
      name: "My Resume",
      now,
      selectedEntryIds: ["entry-1"],
    });

    expect(document).toMatchObject({
      id: "resume-1",
      name: "My Resume",
      type: "resume",
      templateId: "classic",
      content: "",
      selectedEntryIds: ["entry-1"],
      createdAt: now,
      updatedAt: now,
    });
    expect(document.sections.length).toBeGreaterThan(0);
  });

  it("parses valid documents and filters invalid records", () => {
    const valid = createStudioDocument("cover-letter", {
      id: "cover-1",
      now,
      content: "Hello",
    });

    const parsed = parseStudioDocuments(
      JSON.stringify([valid, { id: "bad", type: "tailored" }])
    );

    expect(parsed).toEqual(expect.arrayContaining([valid]));
    expect(parsed.some((document) => document.type === "resume")).toBe(true);
    expect(parsed.some((document) => document.id === "bad")).toBe(false);
  });

  it("falls back to default sections when persisted section ids are invalid", () => {
    const parsed = parseStudioDocuments(
      JSON.stringify([
        {
          id: "resume-1",
          name: "Saved Resume",
          type: "resume",
          templateId: "classic",
          content: "",
          sections: [{ id: "invalid", visible: true }],
          selectedEntryIds: [],
          createdAt: now,
          updatedAt: now,
        },
      ])
    );

    const resume = parsed.find((document) => document.id === "resume-1");

    expect(resume?.sections[0]).toMatchObject({
      id: "experience",
      visible: true,
    });
  });

  it("ensures both tabs have at least one document", () => {
    const resume = createStudioDocument("resume", { id: "resume-1", now });
    const documents = ensureStudioDocuments([resume], now);

    expect(getDocumentsForType(documents, "resume")).toHaveLength(1);
    expect(getDocumentsForType(documents, "cover-letter")).toHaveLength(1);
  });

  it("gets, renames, updates, and deletes documents", () => {
    const resume = createStudioDocument("resume", { id: "resume-1", now });
    const coverLetter = createStudioDocument("cover-letter", {
      id: "cover-1",
      now,
    });
    const documents = [resume, coverLetter];

    expect(getActiveStudioDocument(documents, "resume", "missing")).toBe(resume);

    const renamed = renameStudioDocument(
      documents,
      "resume-1",
      "Updated Resume",
      now
    );
    expect(renamed[0].name).toBe("Updated Resume");

    const updated = updateStudioDocument(
      renamed,
      "resume-1",
      { templateId: "modern", selectedEntryIds: ["entry-2"] },
      now
    );
    expect(updated[0]).toMatchObject({
      templateId: "modern",
      selectedEntryIds: ["entry-2"],
    });

    const deleted = deleteStudioDocument(updated, "resume-1", now);
    expect(deleted.documents.some((document) => document.id === "resume-1")).toBe(
      false
    );
    expect(deleted.activeDocument.type).toBe("resume");
  });

  it("loads and saves documents through storage", () => {
    const document = createStudioDocument("resume", { id: "resume-1", now });
    const storage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify([document])),
      setItem: vi.fn(),
    } as unknown as Storage;

    expect(loadStudioDocuments(storage)).toEqual(
      expect.arrayContaining([document])
    );

    saveStudioDocuments(storage, [document]);
    expect(storage.setItem).toHaveBeenCalledWith(
      STUDIO_DOCUMENT_STORAGE_KEY,
      JSON.stringify([document])
    );
  });
});
