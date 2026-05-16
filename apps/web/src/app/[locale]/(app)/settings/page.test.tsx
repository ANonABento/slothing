import { render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import SettingsPage from "./page";
import messages from "@/messages/en.json";

const mocks = vi.hoisted(() => ({
  useDataIO: vi.fn(),
}));

// jsdom doesn't ship IntersectionObserver. Stub it so the scroll-spy
// nav can mount without throwing.
class StubIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = "";
  thresholds = [];
}

vi.mock("./use-data-io", () => ({
  useDataIO: mocks.useDataIO,
}));

vi.mock("@/components/settings/prompt-variants-section", () => ({
  PromptVariantsSection: () => (
    <section data-testid="prompt-variants-section" />
  ),
}));

vi.mock("@/components/settings/llm/bentorouter-settings-section", () => ({
  BentoRouterSettingsSection: () => (
    <section data-testid="bentorouter-settings-section" />
  ),
}));

vi.mock("@/components/settings/theme-section", () => ({
  ThemeSection: () => <section data-testid="theme-section" />,
}));

vi.mock("@/components/settings/billing-section", () => ({
  BillingSection: () => <section data-testid="billing-section" />,
}));

vi.mock("@/components/settings/locale-section", () => ({
  LocaleSection: () => <section data-testid="locale-section" />,
}));

vi.mock("@/components/settings/language-section", () => ({
  LanguageSection: () => <section data-testid="language-section" />,
}));

vi.mock("@/components/settings/opportunity-review-section", () => ({
  OpportunityReviewSection: () => (
    <section data-testid="opportunity-review-section" />
  ),
}));

vi.mock("@/components/settings/kanban-lanes-section", () => ({
  KanbanLanesSection: () => <section data-testid="kanban-lanes-section" />,
}));

vi.mock("@/components/settings/data-management", () => ({
  DataManagement: () => <section data-testid="data-management" />,
}));

vi.mock("@/components/settings/google-integration", () => ({
  GoogleIntegration: () => <section data-testid="google-integration" />,
}));

vi.mock("@/components/settings/gmail-auto-status-section", () => ({
  GmailAutoStatusSection: () => (
    <section data-testid="gmail-auto-status-section" />
  ),
}));

vi.mock("@/components/settings/danger-zone-section", () => ({
  DangerZoneSection: () => <section data-testid="danger-zone-section" />,
}));

function mockSettingsPage() {
  mocks.useDataIO.mockReturnValue({
    exporting: null,
    importing: false,
    importResult: null,
    showImportPreview: null,
    exportData: vi.fn(),
    handleFileImport: vi.fn(),
    handleFullImportPreview: vi.fn(),
    confirmFullImport: vi.fn(),
    clearImportPreview: vi.fn(),
  });
}

function renderSettingsPage() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SettingsPage />
    </NextIntlClientProvider>,
  );
}

describe("SettingsPage", () => {
  beforeAll(() => {
    // jsdom shim — SettingsNav uses IntersectionObserver for scroll spy.
    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      value: StubIntersectionObserver,
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockSettingsPage();
  });

  it("renders the settings shell at the wide page width", () => {
    const { container } = renderSettingsPage();

    // `wide` is full-bleed now (dropped the `max-w-screen-2xl` cap when
    // the coach rail came out). Editorial header inset is `px-6 py-6`.
    const header = screen.getByRole("banner");
    expect(header.firstElementChild).toHaveClass("px-6", "py-6");

    const content = container.querySelector(".px-6.py-6");
    expect(content).not.toBeNull();
  });

  it("keeps every settings section in the reorganized layout", () => {
    renderSettingsPage();

    expect(
      screen.getByTestId("bentorouter-settings-section"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("prompt-variants-section")).toBeInTheDocument();
    expect(screen.getByTestId("billing-section")).toBeInTheDocument();
    expect(screen.getByTestId("theme-section")).toBeInTheDocument();
    expect(screen.getByTestId("locale-section")).toBeInTheDocument();
    expect(screen.getByTestId("language-section")).toBeInTheDocument();
    expect(
      screen.getByTestId("opportunity-review-section"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("kanban-lanes-section")).toBeInTheDocument();
    expect(screen.getByTestId("data-management")).toBeInTheDocument();
    expect(screen.getByTestId("google-integration")).toBeInTheDocument();
    expect(screen.getByTestId("gmail-auto-status-section")).toBeInTheDocument();
    expect(screen.getByTestId("danger-zone-section")).toBeInTheDocument();
  });

  it("renders the vertical settings nav with anchor links to every section", () => {
    renderSettingsPage();

    const nav = screen.getByRole("navigation", { name: /settings sections/i });
    expect(nav).toBeInTheDocument();

    const linkLabels = [
      "Account",
      "Appearance",
      "Integrations",
      "AI keys",
      "Data",
      "Plan & usage",
      "Danger zone",
    ];
    for (const label of linkLabels) {
      expect(
        within(nav).getByRole("link", { name: new RegExp(`^${label}`, "i") }),
      ).toBeInTheDocument();
    }

    // Every nav link should have a matching section[id] anchor.
    const hrefs = [
      "#account",
      "#appearance",
      "#integrations",
      "#ai-keys",
      "#data",
      "#plan-usage",
      "#danger",
    ];
    for (const href of hrefs) {
      const id = href.slice(1);
      expect(document.getElementById(id)).not.toBeNull();
    }
  });

  it("keeps BentoRouter controls inside the AI keys section", () => {
    renderSettingsPage();
    const aiSection = document.getElementById("ai-keys");

    expect(aiSection).not.toBeNull();
    expect(
      within(aiSection as HTMLElement).getByTestId(
        "bentorouter-settings-section",
      ),
    ).toBeInTheDocument();
  });
});
