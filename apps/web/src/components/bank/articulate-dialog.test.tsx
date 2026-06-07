import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";

const addToast = vi.fn();
vi.mock("@/components/ui/toast", () => ({ useToast: () => ({ addToast }) }));

import { ArticulateDialog } from "./articulate-dialog";

const fetchMock = vi.fn();
beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
  addToast.mockReset();
});
afterEach(() => cleanup());

describe("ArticulateDialog — Draft with AI", () => {
  it("posts mode:articulate with the notes and calls onCreated", async () => {
    const onCreated = vi.fn();
    const onOpenChange = vi.fn();
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        bullets: ["Set up Kubernetes", "Onboarded 3 hires"],
      }),
    });
    render(
      <ArticulateDialog
        open
        onOpenChange={onOpenChange}
        onCreated={onCreated}
      />,
    );

    fireEvent.change(screen.getByLabelText("Your notes"), {
      target: { value: "set up the k8s cluster and onboarded 3 new hires" },
    });
    fireEvent.click(screen.getByText("Draft with AI"));

    await waitFor(() => expect(onCreated).toHaveBeenCalled());
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/bank/ai/draft");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.mode).toBe("articulate");
    expect(body.rawText).toContain("k8s cluster");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("blocks submission for too-short notes (no request)", async () => {
    render(<ArticulateDialog open onOpenChange={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Your notes"), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByText("Draft with AI"));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: "warning" }),
    );
  });

  it("surfaces a server error (e.g. nothing groundable → 422)", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: "Couldn't form a bullet grounded in your notes.",
      }),
    });
    render(<ArticulateDialog open onOpenChange={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Your notes"), {
      target: { value: "did some vague things at a place for a while" },
    });
    fireEvent.click(screen.getByText("Draft with AI"));
    await waitFor(() =>
      expect(addToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: "error" }),
      ),
    );
  });
});
