import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BuilderStep } from "./BuilderStep";

describe("BuilderStep", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ success: true }))),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("disables submit until required fields are present", () => {
    render(<BuilderStep onAdvance={vi.fn()} />);

    const submit = screen.getByRole("button", { name: /Save and continue/i });
    expect(submit).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Target role"), {
      target: { value: "Frontend intern" },
    });

    expect(submit).toBeEnabled();
  });

  it("submits a profile-shaped request body and advances on success", async () => {
    const onAdvance = vi.fn();
    render(<BuilderStep onAdvance={onAdvance} />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Target role"), {
      target: { value: "Frontend intern, Data analyst" },
    });
    fireEvent.change(screen.getByLabelText("Background summary"), {
      target: { value: "Returning to work after leading volunteer programs." },
    });
    fireEvent.change(screen.getByLabelText("School"), {
      target: { value: "State University" },
    });
    fireEvent.change(screen.getByLabelText("Degree"), {
      target: { value: "BA" },
    });
    fireEvent.change(screen.getByLabelText("Field"), {
      target: { value: "Economics" },
    });
    fireEvent.change(screen.getByLabelText("Top skills"), {
      target: { value: "Excel, Research" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Save and continue/i }));

    await waitFor(() => expect(onAdvance).toHaveBeenCalledTimes(1));

    expect(fetch).toHaveBeenCalledWith(
      "/api/onboarding/seed-profile",
      expect.objectContaining({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: expect.any(String),
      }),
    );

    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(JSON.parse(String(init?.body))).toMatchObject({
      contact: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        headline: "Frontend intern, Data analyst",
        targetRoles: ["Frontend intern", "Data analyst"],
      },
      summary: "Returning to work after leading volunteer programs.",
      education: [
        {
          institution: "State University",
          degree: "BA",
          field: "Economics",
          highlights: [],
        },
      ],
      skills: [
        { name: "Excel", category: "other" },
        { name: "Research", category: "other" },
      ],
    });
  });

  it("shows an inline error and stays on the step when the API fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 500 })),
    );
    const onAdvance = vi.fn();
    render(<BuilderStep onAdvance={onAdvance} />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Target role"), {
      target: { value: "Frontend intern" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Save and continue/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to save your profile starter.",
    );
    expect(onAdvance).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { name: "Build Your Starter Profile" }),
    ).toBeInTheDocument();
  });
});
