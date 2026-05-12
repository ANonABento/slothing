import { render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildDashboardPayload } from "@/lib/admin/evals/aggregate";
import { SAMPLE_COMPARISON_REPORTS } from "@/lib/admin/evals/sample-data";
import { EvalHealthSection } from "./eval-health-section";

function renderEvalHealthSection() {
  return render(
    <NextIntlClientProvider locale="en-US" messages={{}}>
      <EvalHealthSection />
    </NextIntlClientProvider>,
  );
}

describe("EvalHealthSection", () => {
  let fetchMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchMock = vi.spyOn(global, "fetch");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders KPIs when the API returns real reports", async () => {
    const payload = buildDashboardPayload(SAMPLE_COMPARISON_REPORTS, {
      source: "reports",
    });
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(payload), { status: 200 }),
    );

    renderEvalHealthSection();

    expect(await screen.findByText("Eval health")).toBeInTheDocument();
    expect(screen.getByText("Last run")).toBeInTheDocument();
    expect(screen.getByText("Runs")).toBeInTheDocument();
    expect(screen.getByText(String(payload.runs.length))).toBeInTheDocument();
    expect(screen.getByText("Avg score")).toBeInTheDocument();
    expect(screen.getByText("Est. cost")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view raw exports/i }),
    ).toHaveAttribute("href", "/api/admin/evals");
  });

  it("renders the empty state when source is sample", async () => {
    const payload = buildDashboardPayload(SAMPLE_COMPARISON_REPORTS, {
      source: "sample",
    });
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(payload), { status: 200 }),
    );

    renderEvalHealthSection();

    expect(
      await screen.findByText(/No eval runs recorded/i),
    ).toBeInTheDocument();
    expect(screen.getByText("npm run eval")).toBeInTheDocument();
  });

  it("renders nothing when the API returns 403 for a non-owner", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 }),
    );

    const { container } = renderEvalHealthSection();

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing on a network error", async () => {
    fetchMock.mockRejectedValue(new Error("network"));

    const { container } = renderEvalHealthSection();

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });
});
