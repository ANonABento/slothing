import "@testing-library/jest-dom";
import { vi } from "vitest";
import "./contract";
import messages from "@/messages/en.json";

type MessageTree = Record<string, unknown>;

function resolveMessage(namespace: string | undefined, key: string) {
  const path = namespace ? `${namespace}.${key}` : key;
  const value = path.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as MessageTree)[segment];
  }, messages);

  return typeof value === "string" ? value : key;
}

function formatMessage(message: string, values?: Record<string, unknown>) {
  if (!values) return message;
  const withPlurals = message.replace(
    /\{([\w-]+),\s*plural,\s*one\s*\{([^{}]*)\}\s*other\s*\{([^{}]*)\}\}/g,
    (match, name, one, other) => {
      const value = values[name];
      if (typeof value !== "number") return match;
      return (value === 1 ? one : other).replace(/#/g, String(value));
    },
  );

  return withPlurals.replace(/\{([\w-]+)\}/g, (match, name) => {
    const value = values[name];
    return value === undefined || typeof value === "function"
      ? match
      : String(value);
  });
}

vi.mock("next-intl", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-intl")>();

  function fallbackTranslations(namespace?: string) {
    const t = (key: string, values?: Record<string, unknown>) =>
      formatMessage(resolveMessage(namespace, key), values);
    t.rich = (key: string, values?: Record<string, unknown>) => {
      const message = formatMessage(resolveMessage(namespace, key), values);
      return message.replace(/<\/?[\w-]+>/g, "");
    };
    return t;
  }

  return {
    ...actual,
    useLocale: () => {
      try {
        return actual.useLocale();
      } catch {
        return "en";
      }
    },
    useTranslations: (namespace?: string) => {
      try {
        return actual.useTranslations(namespace);
      } catch {
        return fallbackTranslations(namespace);
      }
    },
  };
});

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Element.prototype.scrollIntoView = vi.fn();

// Mock ResizeObserver (must be constructable because components call `new ResizeObserver`).
global.ResizeObserver = class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor() {}
} as unknown as typeof globalThis.ResizeObserver;

// Mock IntersectionObserver (must be a proper constructor for Next.js Link)
global.IntersectionObserver = class IntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor() {}
} as unknown as typeof globalThis.IntersectionObserver;
