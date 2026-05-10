import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  AddOpportunityWizard,
  mapScrapedOpportunityToWizard,
} from "./add-opportunity-wizard";
import { ToastProvider } from "@/components/ui/toast";

const mockShowErrorToast = vi.hoisted(() => vi.fn());

vi.mock("@/hooks/use-error-toast", () => ({
  useErrorToast: () => mockShowErrorToast,
}));

function renderWizard(
  props?: Partial<Parameters<typeof AddOpportunityWizard>[0]>,
) {
  const onOpenChange = vi.fn();
  const onSaved = vi.fn();
  const result = render(
    <ToastProvider>
      <AddOpportunityWizard
        open
        onOpenChange={onOpenChange}
        onSaved={onSaved}
        {...props}
      />
    </ToastProvider>,
  );
  return { onOpenChange, onSaved, ...result };
}

describe("AddOpportunityWizard", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  it("keeps Next disabled until Title and Company are filled", () => {
    renderWizard();

    const next = screen.getByRole("button", { name: "Next →" });
    expect(next).toBeDisabled();
    expect(screen.getByLabelText(/Title required/i)).toHaveAttribute(
      "aria-required",
      "true",
    );
    expect(screen.getByLabelText(/Company required/i)).toHaveAttribute(
      "aria-required",
      "true",
    );
    const titleLabel = document.querySelector(
      'label[for="opportunity-title"]',
    ) as HTMLElement;
    const companyLabel = document.querySelector(
      'label[for="opportunity-company"]',
    ) as HTMLElement;
    expect(titleLabel).toHaveTextContent(/Title\s+\*/);
    expect(companyLabel).toHaveTextContent(/Company\s+\*/);

    fireEvent.blur(screen.getByLabelText(/Title/));
    expect(screen.getByLabelText(/Title/)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByText("Enter a title to continue.")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Add the required essentials: Title and Company.",
    );

    fireEvent.change(screen.getByLabelText(/Title/), {
      target: { value: "Frontend Engineer" },
    });
    expect(screen.getByLabelText(/Title/)).toHaveAttribute(
      "aria-invalid",
      "false",
    );
    expect(next).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/Company/), {
      target: { value: "Northstar Labs" },
    });
    expect(next).toBeEnabled();

    fireEvent.change(screen.getByLabelText(/Company/), {
      target: { value: "" },
    });
    fireEvent.blur(screen.getByLabelText(/Company/));
    expect(next).toBeDisabled();
    expect(screen.getByLabelText(/Company/)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(
      screen.getByText("Enter a company to continue."),
    ).toBeInTheDocument();
  });

  it("shows required and optional step context in progress controls", () => {
    renderWizard();

    expect(
      screen.getByRole("button", {
        name: "Step 1 of 4: Essentials, required, current",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Step 2 of 4: Where & how, optional",
      }),
    ).toBeDisabled();
    expect(
      screen.getByText(
        "Step 1 of 4: Essentials. Required: add a title and company before moving on.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the Save & exit confirmation when current step data is dirty", () => {
    renderWizard();

    fireEvent.change(screen.getByLabelText(/Title/), {
      target: { value: "Frontend Engineer" },
    });
    fireEvent.change(screen.getByLabelText(/Company/), {
      target: { value: "Northstar Labs" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Next →" }));

    fireEvent.change(screen.getByLabelText("City"), {
      target: { value: "Toronto" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save & exit" }));

    expect(
      screen.getByRole("alertdialog", {
        name: "Save with the data you've filled?",
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Keep editing" }));
    expect(
      screen.queryByRole("alertdialog", {
        name: "Save with the data you've filled?",
      }),
    ).not.toBeInTheDocument();
  });

  it("saves from the Save & exit confirmation", async () => {
    const onSaved = vi.fn();
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ opportunity: { id: "opp-1" } }),
    } as Response);
    renderWizard({ onSaved });

    fireEvent.change(screen.getByLabelText(/Title/), {
      target: { value: "Frontend Engineer" },
    });
    fireEvent.change(screen.getByLabelText(/Company/), {
      target: { value: "Northstar Labs" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Next →" }));
    fireEvent.change(screen.getByLabelText("City"), {
      target: { value: "Toronto" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save & exit" }));
    fireEvent.click(
      screen.getAllByRole("button", { name: "Save & exit" }).at(-1)!,
    );

    await waitFor(() => expect(onSaved).toHaveBeenCalled());
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/opportunities",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("creates from the final step with a clear primary action", async () => {
    const onSaved = vi.fn();
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ opportunity: { id: "opp-1" } }),
    } as Response);
    renderWizard({ onSaved });

    fireEvent.change(screen.getByLabelText(/Title/), {
      target: { value: "Frontend Engineer" },
    });
    fireEvent.change(screen.getByLabelText(/Company/), {
      target: { value: "Northstar Labs" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Next →" }));
    fireEvent.click(screen.getByRole("button", { name: "Next →" }));
    fireEvent.click(screen.getByRole("button", { name: "Next →" }));

    fireEvent.click(screen.getByRole("button", { name: "Create Opportunity" }));

    await waitFor(() => expect(onSaved).toHaveBeenCalled());
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/opportunities",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("does not overwrite fields edited while URL auto-fill is in flight", async () => {
    let resolveScrape: (response: Response) => void = () => {};
    vi.mocked(global.fetch).mockReturnValue(
      new Promise((resolve) => {
        resolveScrape = resolve;
      }) as Promise<Response>,
    );
    renderWizard();

    fireEvent.change(screen.getByLabelText("URL"), {
      target: { value: "https://jobs.example.com/1" },
    });
    fireEvent.blur(screen.getByLabelText("URL"));
    fireEvent.change(screen.getByLabelText(/Title/), {
      target: { value: "Manual title" },
    });

    resolveScrape({
      ok: true,
      json: async () => ({
        opportunity: {
          title: "Scraped title",
          company: "Acme",
          url: "https://jobs.example.com/1",
        },
      }),
    } as Response);

    await waitFor(() =>
      expect(screen.getByLabelText(/Company/)).toHaveValue("Acme"),
    );
    expect(screen.getByLabelText(/Title/)).toHaveValue("Manual title");
  });

  it("maps scraped opportunity fields into wizard fields", () => {
    expect(
      mapScrapedOpportunityToWizard({
        title: "Software Engineer",
        company: "Acme",
        location: "Toronto, ON, Canada",
        type: "Full-time",
        remote: true,
        salary: "$120,000",
        description: "Build product surfaces.",
        requirements: ["React", "TypeScript"],
        keywords: ["frontend", "platform"],
        url: "https://jobs.example.com/1",
      }),
    ).toMatchObject({
      title: "Software Engineer",
      company: "Acme",
      sourceUrl: "https://jobs.example.com/1",
      city: "Toronto",
      province: "ON",
      country: "Canada",
      remoteType: "remote",
      jobType: "full-time",
      compensationNotes: "$120,000",
      summary: "Build product surfaces.",
      requiredSkills: "React, TypeScript",
      tags: "frontend, platform",
    });
  });
});
