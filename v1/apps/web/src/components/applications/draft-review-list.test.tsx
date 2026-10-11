import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToastProvider } from "@/components/ui/toast";
import { DraftReviewList } from "./draft-review-list";

const DRAFT = {
  id: "d1",
  jobId: "job-1",
  authoredBy: "agent:test",
  status: "pending_review",
  createdAt: "2026-06-08T00:00:00.000Z",
  reviewedAt: null,
  submittedAt: null,
  submitResult: null,
  questions: [
    { id: "q1", label: "Why this company?", type: "textarea", required: true },
    { id: "q2", label: "Years with Go?", type: "text", required: true },
  ],
  answers: [
    {
      questionId: "q1",
      value: "Mission fit.",
      groundedIn: "bank:mission",
      confidence: 0.92,
      source: "bank: mission-fit",
    },
    {
      questionId: "q2",
      value: "Six years",
      groundedIn: "",
      confidence: 0,
      source: "",
    },
  ],
};

function mockFetch(impl: (url: string, init?: RequestInit) => Response) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => impl(url, init)),
  );
}

function renderList() {
  return render(
    <ToastProvider>
      <DraftReviewList />
    </ToastProvider>,
  );
}

describe("DraftReviewList", () => {
  beforeEach(() => {
    mockFetch((url, init) => {
      if (init?.method === "PATCH") {
        return new Response(JSON.stringify({ draft: { id: "d1" } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ drafts: [DRAFT], total: 1 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders questions, answers, confidence, and an ungrounded flag", async () => {
    renderList();
    expect(await screen.findByText("Why this company?")).toBeTruthy();
    expect(screen.getByText("Years with Go?")).toBeTruthy();
    expect(screen.getByDisplayValue("Mission fit.")).toBeTruthy();
    expect(screen.getByText("92% confident")).toBeTruthy();
    // The ungrounded answer (q2) is flagged.
    expect(screen.getByText("Ungrounded")).toBeTruthy();
    expect(screen.getByText(/No supporting evidence/)).toBeTruthy();
  });

  it("approves a draft with a PATCH carrying status approved", async () => {
    renderList();
    const approve = await screen.findByRole("button", { name: /approve/i });
    fireEvent.click(approve);

    await waitFor(() => {
      const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
      const patchCall = fetchMock.mock.calls.find(
        (c: unknown[]) => (c[1] as RequestInit | undefined)?.method === "PATCH",
      );
      expect(patchCall).toBeTruthy();
      expect(String(patchCall![0])).toContain("/api/applications/drafts/d1");
      expect(
        JSON.parse((patchCall![1] as RequestInit).body as string),
      ).toMatchObject({
        status: "approved",
      });
    });
  });

  it("rejects a draft and shows an undo toast", async () => {
    renderList();
    const reject = await screen.findByRole("button", { name: /reject/i });
    fireEvent.click(reject);

    expect(await screen.findByText("Draft rejected")).toBeTruthy();
    expect(screen.getByText("Undo")).toBeTruthy();
  });
});
