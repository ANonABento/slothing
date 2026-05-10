import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProfilePage from "./page";
import type { Profile } from "@/types";

Element.prototype.scrollIntoView = vi.fn();

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ profile: null }),
    } as Response);
  });

  it("makes empty profile summary fields clickable shortcuts to edit fields", async () => {
    render(<ProfilePage />);

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /No email/i }),
      ).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /No email/i }));
    await waitFor(() =>
      expect(screen.getByLabelText("Email address")).toHaveFocus(),
    );

    fireEvent.click(screen.getByRole("button", { name: /No location/i }));
    await waitFor(() =>
      expect(screen.getByLabelText("Location")).toHaveFocus(),
    );

    fireEvent.click(screen.getByRole("button", { name: /No target salary/i }));

    await waitFor(() =>
      expect(screen.getByRole("tab", { name: /Preferences/i })).toHaveAttribute(
        "aria-selected",
        "true",
      ),
    );
    await waitFor(() => expect(screen.getByLabelText("Minimum")).toHaveFocus());
  });

  it("labels long-form profile textareas with explicit accessible names", async () => {
    render(<ProfilePage />);

    expect(
      await screen.findByRole("textbox", { name: "Professional summary" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /Preferences/i }));

    expect(
      screen.getByRole("textbox", { name: "Target roles" }),
    ).toBeInTheDocument();
  });

  it("shows the profile completeness card after loading", async () => {
    render(<ProfilePage />);

    expect(
      await screen.findByText(
        "Profile is 0% complete · 9 quick wins available",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
  });

  it("updates profile completeness live for editable overview fields", async () => {
    render(<ProfilePage />);

    await screen.findByText("Profile is 0% complete · 9 quick wins available");

    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: "Ari Rivers" },
    });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "ari@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Headline"), {
      target: { value: "Product engineer" },
    });
    fireEvent.change(screen.getByLabelText("Professional summary"), {
      target: { value: "I build reliable product workflows." },
    });

    expect(
      await screen.findByText(
        "Profile is 20% complete · 7 quick wins available",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "20",
    );
  });

  it("focuses an editable input when clicking an actionable gap", async () => {
    render(<ProfilePage />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: /Add your name, email, and headline/i,
      }),
    );

    await waitFor(() =>
      expect(screen.getByLabelText("Full name")).toHaveFocus(),
    );
  });

  it("scrolls to display-only profile signal anchors from gaps", async () => {
    const profile: Profile = {
      id: "profile-1",
      contact: {
        name: "Ari Rivers",
        email: "ari@example.com",
        headline: "Product engineer",
        linkedin: "https://linkedin.com/in/ari",
      },
      summary: "I build reliable product workflows.",
      experiences: [
        {
          id: "exp-1",
          company: "Anthropic",
          title: "Product Engineer",
          startDate: "2024-01-01",
          current: true,
          description: "",
          highlights: [
            "Improved activation by 18%",
            "Supported 12 engineers",
            "Shipped workflow tools",
          ],
          skills: [],
        },
      ],
      education: [],
      skills: [
        { id: "ts", name: "TypeScript", category: "technical" },
        { id: "react", name: "React", category: "technical" },
        { id: "node", name: "Node.js", category: "technical" },
        { id: "sql", name: "SQL", category: "technical" },
        { id: "testing", name: "Testing", category: "technical" },
      ],
      projects: [
        {
          id: "project-1",
          name: "Resume Builder",
          description: "",
          technologies: [],
          highlights: [],
        },
      ],
      certifications: [],
    };
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ profile }),
    } as Response);

    render(<ProfilePage />);

    fireEvent.click(
      await screen.findByRole("button", { name: /Add your education/i }),
    );

    await waitFor(() =>
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled(),
    );
  });
});
