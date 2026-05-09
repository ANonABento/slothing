import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthSessionProvider } from "./session-provider";

const sessionProviderMock = vi.hoisted(() => vi.fn());

vi.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => {
    sessionProviderMock();
    return <div data-testid="session-provider">{children}</div>;
  },
}));

describe("AuthSessionProvider", () => {
  it("does not mount NextAuth SessionProvider when auth is not enabled on the client", () => {
    vi.stubEnv("NEXT_PUBLIC_NEXTAUTH_ENABLED", undefined);

    render(
      <AuthSessionProvider>
        <div>App content</div>
      </AuthSessionProvider>,
    );

    expect(screen.getByText("App content")).toBeInTheDocument();
    expect(screen.queryByTestId("session-provider")).not.toBeInTheDocument();
    expect(sessionProviderMock).not.toHaveBeenCalled();
  });

  it("mounts NextAuth SessionProvider only when auth is explicitly enabled", () => {
    vi.stubEnv("NEXT_PUBLIC_NEXTAUTH_ENABLED", "true");

    render(
      <AuthSessionProvider>
        <div>App content</div>
      </AuthSessionProvider>,
    );

    expect(screen.getByTestId("session-provider")).toBeInTheDocument();
    expect(sessionProviderMock).toHaveBeenCalledOnce();
  });
});
