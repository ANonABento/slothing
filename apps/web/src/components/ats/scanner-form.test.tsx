import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToastProvider } from "@/components/ui/toast";
import enMessages from "@/messages/en.json";
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
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <ToastProvider>
          <ScannerForm />
        </ToastProvider>
      </NextIntlClientProvider>,
    );
  }

  function uploadResumeFile(file: File) {
    fireEvent.change(screen.getByLabelText(/Upload resume PDF or text file/i), {
      target: { files: [file] },
    });
  }

  it("shows a drag-drop upload area by default", () => {
    renderWithToast();

    expect(
      screen.getByText(/Drop a PDF here or click to browse/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Upload resume PDF or text file/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Scan Resume/i }),
    ).toHaveAccessibleDescription(
      /Upload a resume or paste at least 50 characters to scan/i,
    );
  });

  it("keeps Scan Resume disabled when a PDF parse has no usable content", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          profile: {
            contact: { name: "" },
            experiences: [],
            skills: [],
            summary: "",
          },
          sectionsDetected: [],
          confidence: 0,
          warnings: ["No readable text found in the PDF."],
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );
    renderWithToast();

    uploadResumeFile(
      new File([""], "scanned-resume.pdf", { type: "application/pdf" }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Parsed 0 sections, confidence 0%/i),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(/No readable text found in the PDF/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/couldn't extract enough content from this PDF/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Scan Resume/i })).toBeDisabled();
  });

  it("enables Scan Resume when a PDF parse has extractable content", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          profile: {
            contact: { name: "Alex Morgan", email: "alex@example.com" },
            experiences: [
              {
                id: "exp-1",
                company: "Acme",
                title: "Frontend Engineer",
                startDate: "2022-01",
                current: true,
                description: "Built React dashboards with TypeScript.",
                highlights: ["Improved reporting workflows."],
                skills: ["React", "TypeScript"],
              },
            ],
            skills: [
              {
                id: "skill-1",
                name: "React",
                category: "technical",
              },
            ],
          },
          sectionsDetected: ["contact", "experience", "skills"],
          confidence: 0.85,
          warnings: [],
          pdfLayout: {
            pageCount: 1,
            hasMultiColumnRisk: true,
            hasHeaderFooterRisk: false,
            hasTableRisk: false,
            hasReadingOrderRisk: true,
            findings: [
              {
                type: "multi-column",
                severity: "warning",
                pageNumber: 1,
                title: "Multi-column PDF layout",
                evidence: "Two dense columns overlap vertically.",
                recommendation: "Use a single-column ATS copy.",
              },
            ],
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );
    renderWithToast();

    uploadResumeFile(
      new File(["pdf"], "resume.pdf", { type: "application/pdf" }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Parsed 3 sections, confidence 85%/i),
      ).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /Scan Resume/i })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: /Scan Resume/i }));

    await waitFor(() => {
      expect(screen.getByText(/PDF layout/i)).toBeInTheDocument();
    });
    expect(
      screen.getByText(/Use a single-column ATS copy/i),
    ).toBeInTheDocument();
  });

  it("shows UI feedback when the selected resume is too large", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<ScannerForm />);

    const file = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "resume.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(screen.getByLabelText(/Upload resume PDF or text file/i), {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(
        screen.getByText(/File too large\. Maximum size is 5 MB\./i),
      ).toBeInTheDocument();
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("shows UI feedback when the selected resume has an unsupported type", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<ScannerForm />);

    const file = new File(["not a resume"], "resume.png", {
      type: "image/png",
    });
    fireEvent.change(screen.getByLabelText(/Upload resume PDF or text file/i), {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Upload a PDF or TXT file\./i),
      ).toBeInTheDocument();
    });
    expect(fetchSpy).not.toHaveBeenCalled();
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
    expect(
      screen.getByText(
        /Job URLs are sent to our servers for temporary scraping/i,
      ),
    ).toBeInTheDocument();
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

  it("does not double-submit URL scraping when Enter is followed by blur", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            opportunity: {
              title: "Senior Frontend Engineer",
              company: "Frontend Co",
              description:
                "Build React and TypeScript interfaces with Playwright tests.",
              requirements: ["React", "TypeScript", "Playwright"],
              responsibilities: [],
              keywords: ["React", "TypeScript", "Playwright"],
              url: "https://example.com/frontend",
            },
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        ),
      ),
    );

    render(<ScannerForm />);

    const url = screen.getByLabelText(/Import job from URL/i);
    fireEvent.change(url, {
      target: { value: "https://example.com/frontend" },
    });
    act(() => {
      url.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true,
          cancelable: true,
        }),
      );
      url.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith("/api/scanner/scrape-job", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: "https://example.com/frontend" }),
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Imported from example.com/i),
      ).toBeInTheDocument();
    });

    fireEvent.keyDown(url, { key: "Enter" });

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });
  });

  it("only imports job URLs after an explicit command", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Unexpected import." }), {
        status: 400,
        headers: { "content-type": "application/json" },
      }),
    );

    render(<ScannerForm />);

    const url = screen.getByLabelText(/Import job from URL/i);
    fireEvent.change(url, {
      target: { value: "https://example.com/frontend" },
    });
    fireEvent.blur(url);
    fireEvent.focus(screen.getByLabelText(/Paste job description/i));

    expect(fetchSpy).not.toHaveBeenCalled();
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
      screen.getByText(
        /Ready to apply|Needs light tailoring|Needs evidence|Not a fit/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Matched with evidence/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Mentioned only/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^Missing$/i)).toBeInTheDocument();

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

  it("uses edited manual JD text after importing a different job", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          opportunity: {
            title: "Senior Frontend Engineer",
            company: "Frontend Co",
            description:
              "Build React and TypeScript interfaces with Playwright tests.",
            requirements: ["React", "TypeScript", "Playwright"],
            responsibilities: [],
            keywords: ["React", "TypeScript", "Playwright"],
            url: "https://example.com/frontend",
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    renderWithToast();

    fireEvent.click(
      screen.getByRole("button", { name: /Paste text instead/i }),
    );
    fireEvent.change(screen.getByLabelText(/Paste your resume text/i), {
      target: {
        value:
          "Built React and TypeScript dashboards for 25,000 users and added Playwright release tests.",
      },
    });
    fireEvent.change(screen.getByLabelText(/Import job from URL/i), {
      target: { value: "https://example.com/frontend" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Import/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Imported from example.com/i),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Paste job description/i), {
      target: {
        value:
          "Data scientist role requiring Python, SQL, machine learning, statistics, and dashboards.",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: /Scan Resume/i }));

    await waitFor(() => {
      expect(screen.getByText(/JD Match/i)).toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", { name: /Copy missing keyword python/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Copy missing keyword react/i }),
    ).not.toBeInTheDocument();
  });

  it("shows a warning for repeated keywords without evidence", async () => {
    renderWithToast();

    fireEvent.click(
      screen.getByRole("button", { name: /Paste text instead/i }),
    );
    fireEvent.change(screen.getByLabelText(/Paste your resume text/i), {
      target: {
        value:
          "React TypeScript Playwright React TypeScript Playwright React TypeScript Playwright React TypeScript Playwright",
      },
    });
    fireEvent.change(screen.getByLabelText(/Paste job description/i), {
      target: {
        value: "React, TypeScript, and Playwright are required.",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: /Scan Resume/i }));

    await waitFor(() => {
      expect(
        screen.getAllByText(/Keyword stuffing or thin evidence/i).length,
      ).toBeGreaterThan(0);
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
