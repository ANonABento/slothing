import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import messages from "@/messages/en.json";
import ExtensionConnectPage from "./page";

const mocks = vi.hoisted(() => ({
  isNextAuthConfiguredOnClient: vi.fn(),
  useSession: vi.fn(),
}));

vi.mock("@/lib/auth-client", () => ({
  isNextAuthConfiguredOnClient: mocks.isNextAuthConfiguredOnClient,
}));

vi.mock("next-auth/react", () => ({
  useSession: mocks.useSession,
}));

function mockFetchResponse(status: number, body: unknown = {}) {
  vi.mocked(fetch).mockResolvedValueOnce(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

function setChromeRuntime(sendMessage?: unknown) {
  Object.defineProperty(globalThis, "chrome", {
    configurable: true,
    value: sendMessage ? { runtime: { sendMessage } } : { runtime: undefined },
  });
}

function renderPage() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ExtensionConnectPage />
    </NextIntlClientProvider>,
  );
}

describe("ExtensionConnectPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState(null, "", "/extension/connect");
    mocks.isNextAuthConfiguredOnClient.mockReturnValue(false);
    mocks.useSession.mockReturnValue({ status: "authenticated" });
    global.fetch = vi.fn();
    setChromeRuntime(undefined);
    vi.mocked(localStorage.setItem).mockClear();
  });

  it("posts friendly and raw device info, then falls back through localStorage", async () => {
    mockFetchResponse(200, {
      token: "token-1",
      expiresAt: "2026-05-09T12:00:00.000Z",
    });

    renderPage();

    await screen.findByText("Extension connected successfully.");

    expect(fetch).toHaveBeenCalledWith(
      "/api/extension/auth",
      expect.objectContaining({
        method: "POST",
        body: expect.any(String),
      }),
    );
    expect(
      JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string),
    ).toEqual(
      expect.objectContaining({
        deviceInfo: expect.stringContaining(" on "),
        userAgent: navigator.userAgent,
        transport: "localstorage",
      }),
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "slothing_extension_token",
      JSON.stringify({
        token: "token-1",
        expiresAt: "2026-05-09T12:00:00.000Z",
        apiBaseUrl: window.location.origin,
      }),
    );
    expect(
      screen.getByText("Return to your browser to use the extension."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Install it" })).toHaveAttribute(
      "href",
      "/en/extension",
    );
  });

  it("sends the token through chrome runtime when reachable", async () => {
    window.history.replaceState(
      null,
      "",
      "/extension/connect?extensionId=abc123",
    );
    const sendMessage = vi.fn((_extensionId, _message, callback) => {
      callback({ success: true });
    });
    setChromeRuntime(sendMessage);
    mockFetchResponse(200, {
      token: "token-1",
      expiresAt: "2026-05-09T12:00:00.000Z",
    });

    renderPage();

    await screen.findByText("Extension connected successfully.");

    expect(
      JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string),
    ).toEqual(expect.objectContaining({ transport: "runtime" }));
    expect(sendMessage).toHaveBeenCalledWith(
      "abc123",
      {
        type: "AUTH_CALLBACK",
        token: "token-1",
        expiresAt: "2026-05-09T12:00:00.000Z",
        apiBaseUrl: window.location.origin,
      },
      expect.any(Function),
    );
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("falls back to localStorage when runtime rejects the callback", async () => {
    window.history.replaceState(
      null,
      "",
      "/extension/connect?extensionId=abc123",
    );
    const sendMessage = vi.fn((_extensionId, _message, callback) => {
      callback({ success: false, error: "no receiving end" });
    });
    setChromeRuntime(sendMessage);
    mockFetchResponse(200, {
      token: "token-1",
      expiresAt: "2026-05-09T12:00:00.000Z",
    });

    renderPage();

    await screen.findByText("Extension connected successfully.");

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "slothing_extension_token",
      JSON.stringify({
        token: "token-1",
        expiresAt: "2026-05-09T12:00:00.000Z",
        apiBaseUrl: window.location.origin,
      }),
    );
  });

  it("falls back to localStorage transport when chrome.runtime is unavailable (e.g. Firefox)", async () => {
    window.history.replaceState(
      null,
      "",
      "/extension/connect?extensionId=abc123",
    );
    mockFetchResponse(200, {
      token: "token-1",
      expiresAt: "2026-05-09T12:00:00.000Z",
    });

    renderPage();

    await screen.findByText("Extension connected successfully.");

    expect(
      JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string),
    ).toEqual(expect.objectContaining({ transport: "localstorage" }));
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "slothing_extension_token",
      JSON.stringify({
        token: "token-1",
        expiresAt: "2026-05-09T12:00:00.000Z",
        apiBaseUrl: window.location.origin,
      }),
    );
  });

  it.each([
    [401, "Sign in expired. Reload the page to retry."],
    [403, "This account isn't allowed to connect the extension."],
    [
      503,
      "Slothing servers are having a problem. Please try again in a minute.",
    ],
    [418, "We couldn't connect the extension. Please try again."],
  ])("shows the diagnostic message for HTTP %i", async (status, message) => {
    mockFetchResponse(status, { error: "nope" });

    renderPage();

    expect(await screen.findByText(message)).toBeInTheDocument();
  });

  it("shows an offline diagnostic when fetch rejects", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Failed to fetch"));

    renderPage();

    expect(
      await screen.findByText(
        "Couldn't reach Slothing. Check your internet connection.",
      ),
    ).toBeInTheDocument();
  });

  it("hides the close button when window.close does not close the tab", async () => {
    mockFetchResponse(200, {
      token: "token-1",
      expiresAt: "2026-05-09T12:00:00.000Z",
    });
    const closeSpy = vi.spyOn(window, "close").mockImplementation(() => {});

    renderPage();

    const button = await screen.findByRole("button", { name: "Close tab" });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Close tab" }),
      ).not.toBeInTheDocument();
    });
    expect(closeSpy).toHaveBeenCalled();

    closeSpy.mockRestore();
  });
});
