import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import StudioPage from "./page";
import type { BankEntry } from "@/types";

vi.mock("@/components/builder/section-list", () => ({
  SectionList: ({
    selectedIds,
    onToggleEntry,
    pickerOpen,
  }: {
    selectedIds: Set<string>;
    onToggleEntry: (entryId: string) => void;
    pickerOpen?: boolean;
  }) => (
    <div>
      <div>Resume sections</div>
      <div>Selected {selectedIds.size}</div>
      {pickerOpen && <div>Bank Entry Picker</div>}
      <button type="button" onClick={() => onToggleEntry("entry-1")}>
        Toggle entry
      </button>
    </div>
  ),
}));

vi.mock("@/components/studio/resume-preview", () => ({
  ResumePreview: ({ html }: { html: string }) => (
    <div>
      <div>Resume preview</div>
      <div data-testid="resume-html">{html}</div>
    </div>
  ),
}));

vi.mock("@/hooks/use-error-toast", () => ({
  useErrorToast: () => vi.fn(),
}));

const bankEntries: BankEntry[] = [
  {
    id: "entry-1",
    userId: "user-1",
    category: "experience",
    content: { title: "Engineer" },
    confidenceScore: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "entry-2",
    userId: "user-1",
    category: "skill",
    content: { name: "TypeScript" },
    confidenceScore: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

function mockStorage(initialValues: Record<string, string> = {}) {
  const values = new Map(Object.entries(initialValues));
  vi.mocked(window.localStorage.getItem).mockImplementation(
    (key) => values.get(key) ?? null
  );
  vi.mocked(window.localStorage.setItem).mockImplementation((key, value) => {
    values.set(key, value);
  });
  vi.mocked(window.localStorage.removeItem).mockImplementation((key) => {
    values.delete(key);
  });
  vi.mocked(window.localStorage.clear).mockImplementation(() => {
    values.clear();
  });
  return values;
}

function mockStudioFetch(entries: BankEntry[] = []) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      if (url === "/api/builder") {
        return new Response(JSON.stringify({ html: "<p>Current HTML</p>" }), {
          status: 200,
        });
      }

      return new Response(JSON.stringify({ entries }), { status: 200 });
    })
  );
}

describe("StudioPage", () => {
  beforeEach(() => {
    mockStorage();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ entries: [] }),
      })
    );
  });

  it("renders resume builder mode by default with a file panel", async () => {
    render(<StudioPage />);

    expect(await screen.findByText("Resume sections")).toBeInTheDocument();
    expect(screen.getByText("Resume preview")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Files" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Resume" })).toHaveLength(2);
  });

  it("renders document mode controls in the studio header", async () => {
    render(<StudioPage />);

    expect(await screen.findByText("Document Studio")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cover Letter" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /tailored/i })).not.toBeInTheDocument();
  });

  it("opens the bank entry picker from the add button", async () => {
    mockStudioFetch(bankEntries);

    render(<StudioPage />);

    fireEvent.click(await screen.findByRole("button", { name: /add from bank/i }));

    expect(screen.getByText("Bank Entry Picker")).toBeInTheDocument();
  });
});
