"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * App-shell chrome state (sidebar collapsed, top bar hidden). Both
 * preferences persist to localStorage so the layout the user picks
 * survives reloads, on a per-browser basis.
 *
 * Naming note: localStorage keys use the legacy `taida:` prefix per
 * CLAUDE.md — do not rename them or existing users lose their
 * preferences.
 */

const STORAGE_KEY_SIDEBAR_COLLAPSED = "taida:chrome:sidebar-collapsed";
const STORAGE_KEY_APPBAR_HIDDEN = "taida:chrome:appbar-hidden";

export const CHROME_STORAGE_KEYS = {
  sidebarCollapsed: STORAGE_KEY_SIDEBAR_COLLAPSED,
  appbarHidden: STORAGE_KEY_APPBAR_HIDDEN,
} as const;

interface ChromeContextValue {
  /** True when the desktop sidebar is in icon-rail mode. */
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (next: boolean) => void;
  toggleSidebar: () => void;

  /** True when the desktop AppBar (top bar) is hidden. */
  appbarHidden: boolean;
  setAppbarHidden: (next: boolean) => void;
  toggleAppbar: () => void;

  /**
   * True once preferences have been read from localStorage. SSR / first
   * render returns the defaults; consumers can use this to suppress
   * transitions until after hydration if they want to avoid a flash.
   */
  hydrated: boolean;
}

const ChromeContext = createContext<ChromeContextValue | null>(null);

function persist(key: string, value: boolean) {
  try {
    window.localStorage.setItem(key, value ? "1" : "0");
  } catch {
    // localStorage may be blocked (private mode, quota, etc.) — ignore.
  }
}

function readBoolean(key: string): boolean | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    return raw === "1";
  } catch {
    return null;
  }
}

interface ChromeProviderProps {
  children: ReactNode;
  /**
   * Optional initial values, mostly for tests. The hydration effect
   * still runs on mount and may overwrite these if the user has a
   * stored preference.
   */
  initialSidebarCollapsed?: boolean;
  initialAppbarHidden?: boolean;
}

export function ChromeProvider({
  children,
  initialSidebarCollapsed = false,
  initialAppbarHidden = false,
}: ChromeProviderProps) {
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(
    initialSidebarCollapsed,
  );
  const [appbarHidden, setAppbarHiddenState] = useState(initialAppbarHidden);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedSidebar = readBoolean(STORAGE_KEY_SIDEBAR_COLLAPSED);
    const storedAppbar = readBoolean(STORAGE_KEY_APPBAR_HIDDEN);
    if (storedSidebar !== null) setSidebarCollapsedState(storedSidebar);
    if (storedAppbar !== null) setAppbarHiddenState(storedAppbar);
    setHydrated(true);
  }, []);

  const setSidebarCollapsed = useCallback((next: boolean) => {
    setSidebarCollapsedState(next);
    persist(STORAGE_KEY_SIDEBAR_COLLAPSED, next);
  }, []);

  const setAppbarHidden = useCallback((next: boolean) => {
    setAppbarHiddenState(next);
    persist(STORAGE_KEY_APPBAR_HIDDEN, next);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsedState((prev) => {
      const next = !prev;
      persist(STORAGE_KEY_SIDEBAR_COLLAPSED, next);
      return next;
    });
  }, []);

  const toggleAppbar = useCallback(() => {
    setAppbarHiddenState((prev) => {
      const next = !prev;
      persist(STORAGE_KEY_APPBAR_HIDDEN, next);
      return next;
    });
  }, []);

  return (
    <ChromeContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        appbarHidden,
        setAppbarHidden,
        toggleAppbar,
        hydrated,
      }}
    >
      {children}
    </ChromeContext.Provider>
  );
}

export function useChrome(): ChromeContextValue {
  const ctx = useContext(ChromeContext);
  if (!ctx) {
    throw new Error("useChrome must be used within a ChromeProvider");
  }
  return ctx;
}

/**
 * Hook variant that's safe to call outside a ChromeProvider — returns
 * null instead of throwing. Useful for components that render in both
 * the app shell and isolated contexts (storybook, tests, marketing).
 */
export function useOptionalChrome(): ChromeContextValue | null {
  return useContext(ChromeContext);
}
