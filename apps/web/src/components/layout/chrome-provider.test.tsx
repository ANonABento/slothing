import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CHROME_STORAGE_KEYS,
  ChromeProvider,
  useChrome,
  useOptionalChrome,
} from "./chrome-provider";

function Harness() {
  const chrome = useChrome();
  return (
    <div>
      <span data-testid="sidebar">{String(chrome.sidebarCollapsed)}</span>
      <span data-testid="appbar">{String(chrome.appbarHidden)}</span>
      <span data-testid="hydrated">{String(chrome.hydrated)}</span>
      <button onClick={chrome.toggleSidebar}>toggle-sidebar</button>
      <button onClick={chrome.toggleAppbar}>toggle-appbar</button>
      <button onClick={() => chrome.setSidebarCollapsed(true)}>
        set-sidebar
      </button>
      <button onClick={() => chrome.setAppbarHidden(true)}>set-appbar</button>
    </div>
  );
}

function OptionalHarness() {
  const chrome = useOptionalChrome();
  return <span data-testid="optional">{chrome === null ? "null" : "ok"}</span>;
}

describe("ChromeProvider", () => {
  // The global test setup stubs window.localStorage with bare vi.fn()
  // mocks that return undefined. We need real storage behavior here, so
  // wire an in-memory store per test.
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    vi.mocked(window.localStorage.getItem).mockImplementation(
      (key: string) => store[key] ?? null,
    );
    vi.mocked(window.localStorage.setItem).mockImplementation(
      (key: string, value: string) => {
        store[key] = String(value);
      },
    );
    vi.mocked(window.localStorage.removeItem).mockImplementation(
      (key: string) => {
        delete store[key];
      },
    );
    vi.mocked(window.localStorage.clear).mockImplementation(() => {
      for (const k of Object.keys(store)) delete store[k];
    });
  });

  afterEach(() => {
    store = {};
    vi.mocked(window.localStorage.getItem).mockReset();
    vi.mocked(window.localStorage.setItem).mockReset();
    vi.mocked(window.localStorage.removeItem).mockReset();
    vi.mocked(window.localStorage.clear).mockReset();
  });

  it("defaults to expanded sidebar and visible appbar", () => {
    render(
      <ChromeProvider>
        <Harness />
      </ChromeProvider>,
    );
    expect(screen.getByTestId("sidebar")).toHaveTextContent("false");
    expect(screen.getByTestId("appbar")).toHaveTextContent("false");
  });

  it("marks hydrated=true after mount", () => {
    render(
      <ChromeProvider>
        <Harness />
      </ChromeProvider>,
    );
    // Hydration runs in useEffect — after the first commit it should
    // have flipped to true.
    expect(screen.getByTestId("hydrated")).toHaveTextContent("true");
  });

  it("toggleSidebar flips state and persists to localStorage", () => {
    render(
      <ChromeProvider>
        <Harness />
      </ChromeProvider>,
    );
    act(() => {
      screen.getByText("toggle-sidebar").click();
    });
    expect(screen.getByTestId("sidebar")).toHaveTextContent("true");
    expect(
      window.localStorage.getItem(CHROME_STORAGE_KEYS.sidebarCollapsed),
    ).toBe("1");
  });

  it("toggleAppbar flips state and persists to localStorage", () => {
    render(
      <ChromeProvider>
        <Harness />
      </ChromeProvider>,
    );
    act(() => {
      screen.getByText("toggle-appbar").click();
    });
    expect(screen.getByTestId("appbar")).toHaveTextContent("true");
    expect(window.localStorage.getItem(CHROME_STORAGE_KEYS.appbarHidden)).toBe(
      "1",
    );
  });

  it("setSidebarCollapsed/setAppbarHidden write through to localStorage", () => {
    render(
      <ChromeProvider>
        <Harness />
      </ChromeProvider>,
    );
    act(() => {
      screen.getByText("set-sidebar").click();
      screen.getByText("set-appbar").click();
    });
    expect(
      window.localStorage.getItem(CHROME_STORAGE_KEYS.sidebarCollapsed),
    ).toBe("1");
    expect(window.localStorage.getItem(CHROME_STORAGE_KEYS.appbarHidden)).toBe(
      "1",
    );
  });

  it("hydrates from localStorage on mount", () => {
    window.localStorage.setItem(CHROME_STORAGE_KEYS.sidebarCollapsed, "1");
    window.localStorage.setItem(CHROME_STORAGE_KEYS.appbarHidden, "1");
    render(
      <ChromeProvider>
        <Harness />
      </ChromeProvider>,
    );
    expect(screen.getByTestId("sidebar")).toHaveTextContent("true");
    expect(screen.getByTestId("appbar")).toHaveTextContent("true");
  });

  it("useChrome throws outside provider", () => {
    // Silence the expected error log from React.
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    expect(() => render(<Harness />)).toThrow(
      /useChrome must be used within a ChromeProvider/,
    );
    consoleSpy.mockRestore();
  });

  it("useOptionalChrome returns null outside provider", () => {
    render(<OptionalHarness />);
    expect(screen.getByTestId("optional")).toHaveTextContent("null");
  });

  it("respects initial values when provided", () => {
    render(
      <ChromeProvider initialSidebarCollapsed initialAppbarHidden>
        <Harness />
      </ChromeProvider>,
    );
    // No localStorage entry — initial values should stick after hydrate.
    expect(screen.getByTestId("sidebar")).toHaveTextContent("true");
    expect(screen.getByTestId("appbar")).toHaveTextContent("true");
  });
});
