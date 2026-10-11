import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthDisabledCard, SignInCard } from "./sign-in-card";

const signInMock = vi.hoisted(() => vi.fn());

vi.mock("next-auth/react", () => ({
  signIn: signInMock,
}));

describe("SignInCard", () => {
  beforeEach(() => {
    signInMock.mockReset();
  });

  it("renders the Vercel-style Google-only state", async () => {
    signInMock.mockResolvedValueOnce(undefined);

    const { asFragment } = render(
      <SignInCard callbackUrl="/dashboard" enableEmailMagicLink={false} />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(
      screen.getByRole("heading", { name: "Sign in to Slothing" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Welcome back/i)).not.toBeInTheDocument();
    expect(
      screen.getByText("Continue with Google to keep going."),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Send magic link/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("or")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Slothing" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.getByRole("link", { name: "Terms of Service" }),
    ).toHaveAttribute("href", "/terms");
    expect(
      screen.getByRole("link", { name: "Privacy Policy" }),
    ).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: /Back to home/i })).toHaveAttribute(
      "href",
      "/",
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Sign in with Google/i }),
    );

    expect(signInMock).toHaveBeenCalledWith("google", {
      callbackUrl: "/dashboard",
    });
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Signing in/i }),
      ).toBeDisabled(),
    );
  });

  it("submits a Resend magic link and renders the confirmation state", async () => {
    signInMock.mockResolvedValueOnce({ ok: true });

    const { asFragment } = render(
      <SignInCard callbackUrl="/dashboard" enableEmailMagicLink />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(
      screen.getByText("Continue with Google or get a magic link by email."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign in with Google/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Send magic link/i }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "kev@example.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /Send magic link/i }));

    await waitFor(() =>
      expect(signInMock).toHaveBeenCalledWith("resend", {
        email: "kev@example.com",
        callbackUrl: "/dashboard",
        redirect: false,
      }),
    );
    expect(await screen.findByText("Check your inbox")).toBeInTheDocument();
    expect(screen.getByText("kev@example.com")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /Use a different email/i }),
    );

    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveValue("");
  });

  it("keeps the magic-link form editable after a send failure", async () => {
    signInMock.mockResolvedValueOnce({ ok: false, error: "resend_failed" });

    render(<SignInCard callbackUrl="/dashboard" enableEmailMagicLink />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "kev@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Send magic link/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not send link. Try again.",
    );
    expect(screen.getByLabelText("Email")).toBeEnabled();
  });

  it("disables sign-in controls while a magic link is sending", async () => {
    let resolveSignIn: (value: { ok: boolean }) => void = () => {};
    signInMock.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveSignIn = resolve;
      }),
    );

    render(<SignInCard callbackUrl="/dashboard" enableEmailMagicLink />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "kev@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Send magic link/i }));

    expect(
      screen.getByRole("button", { name: /Sending link/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Sign in with Google/i }),
    ).toBeDisabled();

    resolveSignIn({ ok: true });

    expect(await screen.findByText("Check your inbox")).toBeInTheDocument();
  });
});

describe("AuthDisabledCard", () => {
  it("renders the disabled auth state with the dev dashboard action", () => {
    const { asFragment } = render(
      <AuthDisabledCard locale="en" showDevDashboardLink />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(
      screen.getByRole("heading", {
        name: "Sign-in is disabled in this environment",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/without Google OAuth credentials/i),
    ).toBeInTheDocument();
    expect(screen.getByText("GOOGLE_CLIENT_ID")).toBeInTheDocument();
    expect(screen.getByText("GOOGLE_CLIENT_SECRET")).toBeInTheDocument();
    expect(screen.getByText("NEXTAUTH_SECRET")).toBeInTheDocument();
    expect(screen.getByText(".env.example")).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Continue to dashboard (dev mode)",
      }),
    ).toHaveAttribute("href", "/en/dashboard");
  });

  it("omits the dev dashboard action in production mode", () => {
    render(<AuthDisabledCard locale="en" showDevDashboardLink={false} />);

    expect(
      screen.queryByRole("link", {
        name: "Continue to dashboard (dev mode)",
      }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Contact your administrator.")).toBeInTheDocument();
  });
});
