import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

vi.mock("@/components/ui/toast", () => {
  const addToast = vi.fn();
  return { useToast: () => ({ addToast }) };
});
vi.mock("@/lib/templates/use-custom-templates", () => ({
  clearCustomTemplateCache: vi.fn(),
}));

import { CustomTemplateManagerDialog } from "./custom-template-manager";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});
afterEach(() => cleanup());

function listResponse() {
  return {
    ok: true,
    json: async () => ({
      templates: [
        { id: "built-1", name: "Classic", type: "built-in" },
        {
          id: "imp-1",
          name: "My Import",
          type: "custom",
          sourceFilename: "resume.pdf",
        },
      ],
    }),
  };
}

describe("CustomTemplateManagerDialog", () => {
  it("lists only custom templates and applies one via onTemplateSelected", async () => {
    fetchMock.mockResolvedValueOnce(listResponse());
    const onTemplateSelected = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <CustomTemplateManagerDialog
        open
        onOpenChange={onOpenChange}
        onTemplatesChanged={vi.fn()}
        onTemplateSelected={onTemplateSelected}
      />,
    );

    await waitFor(() =>
      expect(screen.getByText("My Import")).toBeInTheDocument(),
    );
    // Built-in templates are not listed in the manager.
    expect(screen.queryByText("Classic")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Use"));
    await waitFor(() =>
      expect(onTemplateSelected).toHaveBeenCalledWith("imp-1"),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renames a template via PATCH /api/templates", async () => {
    fetchMock.mockResolvedValueOnce(listResponse()); // initial load
    render(
      <CustomTemplateManagerDialog
        open
        onOpenChange={vi.fn()}
        onTemplatesChanged={vi.fn()}
      />,
    );
    await waitFor(() =>
      expect(screen.getByText("My Import")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByLabelText("Rename"));
    const input = await screen.findByDisplayValue("My Import");

    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // PATCH
    fetchMock.mockResolvedValueOnce(listResponse()); // reload
    fireEvent.change(input, { target: { value: "Renamed" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      const patch = fetchMock.mock.calls.find(
        (c) =>
          c[0] === "/api/templates" &&
          (c[1] as RequestInit)?.method === "PATCH",
      );
      expect(patch).toBeTruthy();
      expect(
        JSON.parse((patch![1] as RequestInit).body as string),
      ).toMatchObject({
        id: "imp-1",
        name: "Renamed",
      });
    });
  });
});
