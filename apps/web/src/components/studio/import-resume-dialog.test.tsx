import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";

import { DEFAULT_TEMPLATES } from "@slothing/shared/resume-template";

vi.mock("@/components/ui/toast", () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

import { ImportResumeDialog } from "./import-resume-dialog";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});
afterEach(() => cleanup());

function importResponse() {
  return {
    ok: true,
    json: async () => ({
      route: "fingerprint",
      scanned: false,
      rdm: {
        basics: { name: "Jane Doe" },
        work: [],
        education: [],
        skills: [{ name: "Lang", keywords: ["TS"] }],
      },
      classification: {
        template: { ...DEFAULT_TEMPLATES[0], id: "cloned" },
        usedDefaults: ["sectionTitle"],
      },
      suggestedTemplate: DEFAULT_TEMPLATES[0],
      unknownHeaders: [],
      sourceFilename: "jane.pdf",
      sourceType: "pdf",
    }),
  };
}

describe("ImportResumeDialog — preview + nudge + accept loop", () => {
  it("imports, previews, nudges, and commits the accepted template", async () => {
    const onImported = vi.fn();
    render(
      <ImportResumeDialog
        open
        onOpenChange={() => {}}
        onImported={onImported}
      />,
    );

    // Upload a PDF → POST /api/templates/import
    fetchMock.mockResolvedValueOnce(importResponse());
    const file = new File([new Uint8Array([1, 2, 3])], "jane.pdf", {
      type: "application/pdf",
    });
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    // Preview iframe appears once extraction resolves.
    await waitFor(() =>
      expect(screen.getByTitle("Template preview")).toBeInTheDocument(),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/templates/import",
      expect.objectContaining({ method: "POST" }),
    );

    // Nudge a grammar axis (density → airy).
    const densitySelect = screen
      .getByText("Density")
      .parentElement?.querySelector("select") as HTMLSelectElement;
    fireEvent.change(densitySelect, { target: { value: "airy" } });

    // Accept → POST /api/templates/import/commit with the nudged template.
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "tpl-9" }),
    });
    fireEvent.click(screen.getByText("Accept template"));

    await waitFor(() =>
      expect(onImported).toHaveBeenCalledWith("tpl-9", "html"),
    );
    const commitCall = fetchMock.mock.calls.find(
      (c) => c[0] === "/api/templates/import/commit",
    );
    expect(commitCall).toBeTruthy();
    const body = JSON.parse((commitCall![1] as RequestInit).body as string);
    expect(body.template.grammar.density).toBe("airy");
    expect(body.rdm.basics.name).toBe("Jane Doe");
    // The chosen export engine is persisted with the template (default "html").
    expect(body.engine).toBe("html");
  });

  it("commits engine 'typst' (not the 'Typeset' label) when Typeset is selected (F-006)", async () => {
    const onImported = vi.fn();
    render(
      <ImportResumeDialog
        open
        onOpenChange={() => {}}
        onImported={onImported}
      />,
    );

    fetchMock.mockResolvedValueOnce(importResponse());
    const file = new File([new Uint8Array([1, 2, 3])], "jane.pdf", {
      type: "application/pdf",
    });
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() =>
      expect(screen.getByTitle("Template preview")).toBeInTheDocument(),
    );

    // Flip the export engine to Typeset.
    fireEvent.click(screen.getByText("Typeset"));

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "tpl-typst" }),
    });
    fireEvent.click(screen.getByText("Accept template"));

    await waitFor(() =>
      expect(onImported).toHaveBeenCalledWith("tpl-typst", "typst"),
    );
    const commitCall = fetchMock.mock.calls.find(
      (c) => c[0] === "/api/templates/import/commit",
    );
    const body = JSON.parse((commitCall![1] as RequestInit).body as string);
    // The schema only accepts "html" | "typst" — sending "typeset" would 400.
    expect(body.engine).toBe("typst");
  });
});
