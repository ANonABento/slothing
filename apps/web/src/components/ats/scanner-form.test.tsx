import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToastProvider } from "@/components/ui/toast";
import { ScannerForm } from "./scanner-form";

describe("ScannerForm", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  function renderWithToast() {
    return render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <ToastProvider>
          <ScannerForm />
        </ToastProvider>
      </NextIntlClientProvider>,
    );
  }

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

  it("keeps JD matching optional when analyzing a resume only", async () => {
    renderWithToast();

    fireEvent.click(
      screen.getByRole("button", { name: /Paste text instead/i }),
    );
    fireEvent.change(screen.getByLabelText(/Paste your resume text/i), {
      target: {
        value:
          "Frontend engineer with React, TypeScript, accessibility, analytics, and dashboard delivery experience.",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: /Scan Resume/i }));

    await waitFor(() => {
      expect(screen.getByText(/Scoring axes/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/JD Match/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/Paste the target job description to judge role fit/i),
    ).toBeInTheDocument();
  });

  it("renders JD match results and copies missing keyword chips", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    renderWithToast();

    fireEvent.click(
      screen.getByRole("button", { name: /Paste text instead/i }),
    );
    fireEvent.change(screen.getByLabelText(/Paste your resume text/i), {
      target: {
        value:
          "Frontend engineer with React, accessibility, analytics, and dashboard delivery experience.",
      },
    });
    fireEvent.change(screen.getByLabelText(/Paste job description/i), {
      target: {
        value:
          "This role requires React, TypeScript, AWS, SQL, and customer success collaboration.",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: /Scan Resume/i }));

    await waitFor(() => {
      expect(screen.getByText(/JD Match/i)).toBeInTheDocument();
    });
    expect(
      screen.getByText(/Ready to apply|Needs light tailoring|Needs evidence|Not a fit/i),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: /Copy missing keyword typescript/i,
      }),
    );

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("typescript");
      expect(screen.getByText(/Keyword copied/i)).toBeInTheDocument();
    });
  });

  it("flags keyword-stuffed resumes as needing evidence", async () => {
    renderWithToast();

    fireEvent.click(
      screen.getByRole("button", { name: /Paste text instead/i }),
    );
    fireEvent.change(screen.getByLabelText(/Paste your resume text/i), {
      target: {
        value: [
          "React React React React React React React React React React React React.",
          "TypeScript TypeScript TypeScript TypeScript.",
          "Frontend developer with skills section only.",
        ].join(" "),
      },
    });
    fireEvent.change(screen.getByLabelText(/Paste job description/i), {
      target: {
        value:
          "Frontend role requiring React, TypeScript, GraphQL, accessibility, and product delivery.",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: /Scan Resume/i }));

    await waitFor(() => {
      expect(screen.getByText("Needs evidence")).toBeInTheDocument();
    });
    expect(screen.getByText(/Replace repeated keywords/i)).toBeInTheDocument();
  });
});
