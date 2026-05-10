import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getNavigationCommands,
  getActionCommands,
  loadRecentActions,
  saveRecentAction,
  buildRecentCommands,
  incrementCommandUsage,
  loadFrequentActions,
  loadFrequencyMap,
  buildFrequentCommands,
  type CommandItem,
} from "./command-palette";

function stubLocalStorage() {
  const store: Record<string, string> = {};
  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  });
}

describe("getNavigationCommands", () => {
  it("returns navigation commands with expected fields", () => {
    const commands = getNavigationCommands();
    expect(commands.length).toBeGreaterThan(0);
    for (const cmd of commands) {
      expect(cmd.category).toBe("navigate");
      expect(cmd.id).toBeTruthy();
      expect(cmd.label).toBeTruthy();
      expect(cmd.href).toBeTruthy();
    }
  });

  it("includes Dashboard, Settings, and Profile", () => {
    const commands = getNavigationCommands();
    const ids = commands.map((c) => c.id);
    expect(ids).toContain("nav-dashboard");
    expect(ids).toContain("nav-settings");
    expect(ids).toContain("nav-profile");
  });

  it("uses Document Studio instead of separate document routes", () => {
    const commands = getNavigationCommands();
    expect(commands.map((c) => c.href)).toContain("/studio");
    expect(commands.map((c) => c.href)).not.toContain("/builder");
    expect(commands.map((c) => c.href)).not.toContain("/tailor");
    expect(commands.map((c) => c.href)).not.toContain("/cover-letter");
  });
});

describe("getActionCommands", () => {
  it("returns action commands", () => {
    const commands = getActionCommands();
    expect(commands.length).toBeGreaterThan(0);
    for (const cmd of commands) {
      expect(cmd.category).toBe("actions");
    }
  });

  it("links document actions to Document Studio without mode URLs", () => {
    const commands = getActionCommands();
    const studio = commands.find((cmd) => cmd.id === "act-studio");
    expect(studio?.href).toBe("/studio");
    expect(commands.filter((cmd) => cmd.href?.startsWith("/studio?"))).toEqual(
      [],
    );
  });

  it("includes core quick actions", () => {
    const ids = getActionCommands().map((cmd) => cmd.id);
    expect(ids).toContain("act-new-opportunity");
    expect(ids).toContain("act-tailor");
    expect(ids).toContain("act-upload");
    expect(ids).toContain("act-profile");
    expect(ids).toContain("act-settings");
  });
});

describe("loadRecentActions / saveRecentAction", () => {
  beforeEach(stubLocalStorage);

  it("returns empty array when no data stored", () => {
    expect(loadRecentActions()).toEqual([]);
  });

  it("saves and loads a recent action", () => {
    saveRecentAction("nav-dashboard");
    expect(loadRecentActions()).toEqual(["nav-dashboard"]);
  });

  it("moves duplicate to front", () => {
    saveRecentAction("nav-dashboard");
    saveRecentAction("nav-settings");
    saveRecentAction("nav-dashboard");
    expect(loadRecentActions()).toEqual(["nav-dashboard", "nav-settings"]);
  });

  it("limits to 5 recent actions", () => {
    for (let i = 0; i < 7; i++) {
      saveRecentAction(`item-${i}`);
    }
    expect(loadRecentActions()).toHaveLength(5);
    expect(loadRecentActions()[0]).toBe("item-6");
  });
});

describe("incrementCommandUsage / loadFrequentActions", () => {
  beforeEach(stubLocalStorage);

  it("returns an empty array when no frequency data exists", () => {
    expect(loadFrequentActions()).toEqual([]);
  });

  it("increments unique IDs and sorts by usage count", () => {
    incrementCommandUsage("nav-dashboard");
    incrementCommandUsage("act-upload");
    incrementCommandUsage("act-upload");

    expect(loadFrequencyMap()).toEqual({
      "nav-dashboard": 1,
      "act-upload": 2,
    });
    expect(loadFrequentActions()).toEqual(["act-upload", "nav-dashboard"]);
  });

  it("truncates to the requested limit", () => {
    incrementCommandUsage("a");
    incrementCommandUsage("b");
    incrementCommandUsage("b");
    incrementCommandUsage("c");
    incrementCommandUsage("c");
    incrementCommandUsage("c");

    expect(loadFrequentActions(2)).toEqual(["c", "b"]);
  });

  it("returns an empty map for malformed JSON", () => {
    vi.mocked(localStorage.getItem).mockReturnValueOnce("{bad");
    expect(loadFrequencyMap()).toEqual({});
  });
});

describe("buildRecentCommands", () => {
  const allCommands: CommandItem[] = [
    {
      id: "nav-dashboard",
      label: "Dashboard",
      category: "navigate",
      href: "/dashboard",
    },
    {
      id: "nav-settings",
      label: "Settings",
      category: "navigate",
      href: "/settings",
    },
    { id: "act-upload", label: "Upload Resume", category: "actions" },
  ];

  it("builds recent commands from IDs", () => {
    const result = buildRecentCommands(
      ["nav-dashboard", "act-upload"],
      allCommands,
    );
    expect(result).toHaveLength(2);
    expect(result[0].category).toBe("recent");
    expect(result[0].label).toBe("Dashboard");
    expect(result[1].label).toBe("Upload Resume");
  });

  it("preserves order of recent IDs", () => {
    const result = buildRecentCommands(
      ["act-upload", "nav-dashboard"],
      allCommands,
    );
    expect(result[0].id).toBe("act-upload");
    expect(result[1].id).toBe("nav-dashboard");
  });

  it("skips unknown IDs", () => {
    const result = buildRecentCommands(
      ["unknown-id", "nav-dashboard"],
      allCommands,
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("nav-dashboard");
  });

  it("returns empty array for empty input", () => {
    expect(buildRecentCommands([], allCommands)).toEqual([]);
  });
});

describe("buildFrequentCommands", () => {
  const allCommands: CommandItem[] = [
    {
      id: "nav-dashboard",
      label: "Dashboard",
      category: "navigate",
      href: "/dashboard",
    },
    {
      id: "nav-settings",
      label: "Settings",
      category: "navigate",
      href: "/settings",
    },
    { id: "act-upload", label: "Upload Resume", category: "actions" },
  ];

  it("builds frequent commands and excludes recent IDs", () => {
    const result = buildFrequentCommands(
      ["nav-dashboard", "act-upload", "nav-settings"],
      allCommands,
      ["nav-dashboard"],
    );
    expect(result.map((command) => command.id)).toEqual([
      "act-upload",
      "nav-settings",
    ]);
    expect(result.every((command) => command.category === "frequent")).toBe(
      true,
    );
  });
});
