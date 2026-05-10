import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScannerForm } from "./scanner-form";

describe("ScannerForm", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a drag-drop upload area by default", () => {
    render(<ScannerForm />);

    expect(
      screen.getByText(/Drop a PDF here or click to browse/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Upload resume PDF or text file/i),
    ).toBeInTheDocument();
  });

  it("keeps paste text as a prominent fallback", () => {
    render(<ScannerForm />);

    fireEvent.click(
      screen.getByRole("button", { name: /Paste text instead/i }),
    );
    const resume = screen.getByLabelText(/Paste your resume text/i);
    const job = screen.getByLabelText(/Paste job description/i);

    expect(resume.className).toContain("min-h-[200px]");
    expect(job.className).toContain("min-h-[96px]");
    expect(job.className).toContain("placeholder:italic");
    expect(job).toHaveAttribute(
      "placeholder",
      expect.stringMatching(/^Optional:/),
    );
  });

  it("renders a job URL input above the manual job textarea", () => {
    render(<ScannerForm />);

    const url = screen.getByLabelText(/Import job from URL/i);
    const job = screen.getByLabelText(/Paste job description/i);

    expect(
      url.compareDocumentPosition(job) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("shows a manual paste hint when URL scraping fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Unsupported job board." }), {
        status: 400,
        headers: { "content-type": "application/json" },
      }),
    );
    render(<ScannerForm />);

    fireEvent.change(screen.getByLabelText(/Import job from URL/i), {
      target: { value: "https://example.com/job" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Import/i }));

    await waitFor(() => {
      expect(screen.getByText(/Paste manually instead/i)).toBeInTheDocument();
    });
  });
});
