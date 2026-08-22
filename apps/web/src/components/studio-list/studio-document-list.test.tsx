import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

const push = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn(), back: vi.fn() }),
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const addToast = vi.fn();
vi.mock("@/components/ui/toast", () => ({
  useToast: () => ({ addToast }),
}));

const showErrorToast = vi.fn();
vi.mock("@/hooks/use-error-toast", () => ({
  useErrorToast: () => showErrorToast,
}));

// The grid card renders a real PDF; nothing in these tests is about that.
vi.mock("./use-document-thumbnail", () => ({
  useDocumentThumbnail: () => ({ state: { status: "idle" }, ref: () => {} }),
}));

import { StudioDocumentList } from "./studio-document-list";

const DOCS = [
  {
    id: "doc-1",
    title: "Backend resume",
    kind: "resume" as const,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
  },
  {
    id: "doc-2",
    title: "Stripe letter",
    kind: "cover_letter" as const,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z",
  },
];

function mockFetch(handler: (url: string, init?: RequestInit) => unknown) {
  return vi.fn(async (url: string, init?: RequestInit) => {
    const body = handler(String(url), init);
    return {
      ok: true,
      status: 200,
      headers: { get: () => "application/json" },
      json: async () => body,
    } as unknown as Response;
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  const store = new Map<string, string>();
  vi.mocked(window.localStorage.getItem).mockImplementation(
    (key: string) => store.get(key) ?? null,
  );
  vi.mocked(window.localStorage.setItem).mockImplementation(
    (key: string, value: string) => {
      store.set(key, value);
    },
  );
  vi.stubGlobal(
    "fetch",
    mockFetch(() => ({ documents: DOCS })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

async function renderList() {
  render(<StudioDocumentList />);
  expect(await screen.findByText("Backend resume")).toBeInTheDocument();
}

describe("StudioDocumentList", () => {
  it("lists documents with their kind", async () => {
    await renderList();
    // Once as a filter chip, once as the row's kind label.
    expect(screen.getAllByText(/Cover letter/).length).toBeGreaterThan(0);
    expect(screen.getByText("2 documents")).toBeInTheDocument();
  });

  it("filters by search text", async () => {
    await renderList();

    fireEvent.change(screen.getByLabelText("Search documents"), {
      target: { value: "stripe" },
    });

    expect(screen.queryByText("Backend resume")).not.toBeInTheDocument();
    expect(screen.getByText("Stripe letter")).toBeInTheDocument();
    expect(screen.getByText("1 of 2 documents")).toBeInTheDocument();
  });

  it("says so when a filter matches nothing, rather than looking empty", async () => {
    await renderList();

    fireEvent.change(screen.getByLabelText("Search documents"), {
      target: { value: "zzzz" },
    });

    expect(screen.getByText("Nothing matches")).toBeInTheDocument();
    // The distinction matters: "you have no documents" and "your filter hides them all"
    // need different wording or the user goes looking for lost work.
    expect(screen.queryByText("No documents yet")).not.toBeInTheDocument();
  });

  it("remembers the grid choice in localStorage", async () => {
    await renderList();

    fireEvent.click(screen.getByLabelText("Grid view"));

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "taida:studio:view",
      "grid",
    );
  });

  describe("delete", () => {
    it("asks before deleting and does nothing when cancelled", async () => {
      const calls: string[] = [];
      vi.stubGlobal(
        "fetch",
        mockFetch((url, init) => {
          calls.push(`${init?.method ?? "GET"} ${url}`);
          return { documents: DOCS };
        }),
      );
      await renderList();

      fireEvent.click(screen.getByLabelText("Delete Backend resume"));
      expect(
        await screen.findByText("Delete “Backend resume”?"),
      ).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

      await waitFor(() =>
        expect(
          screen.queryByText("Delete “Backend resume”?"),
        ).not.toBeInTheDocument(),
      );
      expect(calls.some((call) => call.startsWith("DELETE"))).toBe(false);
      expect(screen.getByText("Backend resume")).toBeInTheDocument();
    });

    it("deletes and removes the row once confirmed", async () => {
      const calls: string[] = [];
      vi.stubGlobal(
        "fetch",
        mockFetch((url, init) => {
          calls.push(`${init?.method ?? "GET"} ${url}`);
          return init?.method === "DELETE"
            ? { success: true }
            : { documents: DOCS };
        }),
      );
      await renderList();

      fireEvent.click(screen.getByLabelText("Delete Backend resume"));
      const dialog = await screen.findByRole("dialog");
      fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }));

      await waitFor(() =>
        expect(screen.queryByText("Backend resume")).not.toBeInTheDocument(),
      );
      expect(calls).toContain("DELETE /api/tex-documents/doc-1");
    });
  });

  it("renames optimistically and rolls back on failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        if (init?.method === "PATCH") {
          return {
            ok: false,
            status: 500,
            headers: { get: () => "application/json" },
            json: async () => ({ error: "nope" }),
          } as unknown as Response;
        }
        return {
          ok: true,
          status: 200,
          headers: { get: () => "application/json" },
          json: async () => ({ documents: DOCS }),
        } as unknown as Response;
      }),
    );
    await renderList();

    fireEvent.click(screen.getByLabelText("Rename Backend resume"));
    const field = await screen.findByLabelText("Document name");
    fireEvent.change(field, { target: { value: "Renamed" } });
    fireEvent.keyDown(field, { key: "Enter" });

    await waitFor(() =>
      expect(screen.getByText("Backend resume")).toBeInTheDocument(),
    );
    expect(showErrorToast).toHaveBeenCalled();
  });

  it("duplicates into the list without a reload", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch((url) =>
        url.endsWith("/duplicate")
          ? {
              document: {
                ...DOCS[0],
                id: "doc-3",
                title: "Backend resume (copy)",
              },
            }
          : { documents: DOCS },
      ),
    );
    await renderList();

    fireEvent.click(screen.getByLabelText("Duplicate Backend resume"));

    expect(
      await screen.findByText("Backend resume (copy)"),
    ).toBeInTheDocument();
  });

  it("offers a way to create a document even with an empty bank", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch(() => ({ documents: [] })),
    );
    render(<StudioDocumentList />);
    expect(await screen.findByText("No documents yet")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /New document/ }));

    // The blank starter is the path that does not depend on bank content.
    expect(await screen.findByText("A blank starter")).toBeInTheDocument();
  });
});
