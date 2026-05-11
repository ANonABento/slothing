import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "./page";
import { BASIC_ONBOARDING_STEPS } from "@/lib/onboarding/steps";
import messages from "@/messages/en.json";

const toastMock = vi.hoisted(() => vi.fn());

vi.mock("@/hooks/use-error-toast", () => ({
  useErrorToast: () => toastMock,
}));

function mockFetch({
  dismissedAt = null,
  firstName = "Kevin",
  documents = [],
  jobsByStatus = {},
  resumesGenerated = 0,
  streakFails = false,
}: {
  dismissedAt?: string | null;
  firstName?: string | null;
  documents?: Array<Record<string, unknown>>;
  jobsByStatus?: Record<string, number>;
  resumesGenerated?: number;
  streakFails?: boolean;
} = {}) {
  let shouldFailStreak = streakFails;

  global.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);

    if (url === "/api/profile") {
      return jsonResponse({ profile: null });
    }

    if (url.startsWith("/api/documents")) {
      return jsonResponse({ documents });
    }

    if (url === "/api/analytics") {
      return jsonResponse({
        overview: { totalResumesGenerated: resumesGenerated },
        jobs: { byStatus: jobsByStatus },
        recent: { jobs: [] },
      });
    }

    if (url === "/api/onboarding/dismiss" && init?.method === "POST") {
      return jsonResponse({
        dismissedAt: "2026-05-09T10:00:00.000Z",
        firstName,
      });
    }

    if (url === "/api/onboarding/state") {
      return jsonResponse({ dismissedAt, firstName });
    }

    if (url === "/api/streak") {
      if (shouldFailStreak) {
        return jsonResponse({ error: "Failed to get streak state" }, 400);
      }

      return jsonResponse({ streak: null });
    }

    throw new Error(`Unexpected fetch: ${url}`);
  }) as typeof fetch;

  return {
    resolveStreak() {
      shouldFailStreak = false;
    },
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

function renderDashboard() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Dashboard />
    </NextIntlClientProvider>,
  );
}

describe("Dashboard onboarding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders basic onboarding steps from the registry", async () => {
    mockFetch();

    renderDashboard();

    expect(
      await screen.findByText("Welcome, Kevin. Let's set up your workspace."),
    ).toBeInTheDocument();
    expect(
      screen.getByText((_content, element) =>
        Boolean(
          element?.textContent ===
          `0of ${BASIC_ONBOARDING_STEPS.length} complete`,
        ),
      ),
    ).toBeInTheDocument();
    for (const step of BASIC_ONBOARDING_STEPS) {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    }
    expect(screen.queryByText("Next best move")).not.toBeInTheDocument();
  });

  it("renders the active dashboard when onboarding is dismissed", async () => {
    mockFetch({ dismissedAt: "2026-05-09T10:00:00.000Z" });

    renderDashboard();

    expect(
      await screen.findByText(
        "Welcome back, Kevin. Here's what needs your attention.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("posts skip and moves to active dashboard without reloading", async () => {
    mockFetch();

    renderDashboard();

    fireEvent.click(
      await screen.findByRole("button", { name: "Skip onboarding" }),
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/onboarding/dismiss", {
        method: "POST",
      });
    });
    expect(
      await screen.findByText(
        "Welcome back, Kevin. Here's what needs your attention.",
      ),
    ).toBeInTheDocument();
  });

  it("drops the name when onboarding state has no first name", async () => {
    mockFetch({ firstName: null });

    renderDashboard();

    expect(
      await screen.findByText("Let's set up your workspace."),
    ).toBeInTheDocument();
  });

  it("renders available dashboard panels when streak fails and retries only that panel", async () => {
    const fetchMock = mockFetch({
      dismissedAt: "2026-05-09T10:00:00.000Z",
      documents: [{ id: "doc-1" }],
      jobsByStatus: { saved: 2 },
      streakFails: true,
    });

    renderDashboard();

    expect(
      await screen.findByText(
        "Welcome back, Kevin. Here's what needs your attention.",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Documents").length).toBeGreaterThan(0);
    expect(screen.getByText("Recent opportunities")).toBeInTheDocument();
    expect(screen.getByText("Couldn't load this section")).toBeInTheDocument();

    fetchMock.resolveStreak();
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));

    await waitFor(() => {
      expect(
        (global.fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
          ([input]) => String(input) === "/api/streak",
        ),
      ).toHaveLength(2);
    });
  });
});
