import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeSection } from "./theme-section";

describe("ThemeSection", () => {
  beforeEach(() => {
    vi.mocked(window.localStorage.getItem).mockReturnValue(null);
    vi.mocked(window.localStorage.setItem).mockClear();
    document.documentElement.removeAttribute("style");
  });

  it("renders preset and customize theme options", () => {
    render(<ThemeSection />);

    expect(screen.getByRole("heading", { name: "Theme" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /taida/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ocean/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /forest/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /customize/i })).toBeInTheDocument();
  });

  it("applies and persists a selected preset", () => {
    render(<ThemeSection />);

    fireEvent.click(screen.getByRole("button", { name: /ocean/i }));

    expect(document.documentElement.style.getPropertyValue("--primary")).toBe("190 86% 38%");
    expect(window.localStorage.setItem).toHaveBeenCalledWith("get_me_job_theme_preset", "ocean");
  });

  it("shows color controls and applies custom color edits", () => {
    render(<ThemeSection />);

    fireEvent.click(screen.getByRole("button", { name: /customize/i }));
    fireEvent.change(screen.getByLabelText("Primary color"), { target: { value: "#22c55e" } });

    expect(document.documentElement.style.getPropertyValue("--primary")).toBe("142 71% 45%");
    expect(window.localStorage.setItem).toHaveBeenCalledWith("get_me_job_theme_preset", "custom");
  });
});
