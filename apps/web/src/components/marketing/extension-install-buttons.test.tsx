import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ExtensionInstallButtons } from "./extension-install-buttons";

function setUserAgent(userAgent: string) {
  Object.defineProperty(window.navigator, "userAgent", {
    configurable: true,
    value: userAgent,
  });
}

describe("ExtensionInstallButtons", () => {
  beforeEach(() => {
    setUserAgent("curl/8.0");
  });

  it("places the detected Chrome listing first without linking to a placeholder store page", async () => {
    setUserAgent(
      "Mozilla/5.0 AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
    );

    render(<ExtensionInstallButtons variant="primary" />);

    expect(
      await screen.findByRole("button", {
        name: /chrome listing coming soon/i,
      }),
    ).toBeDisabled();
    expect(
      screen.queryByRole("link", { name: /chrome/i }),
    ).not.toBeInTheDocument();
  });

  it("shows Safari as a disabled coming-soon state", async () => {
    setUserAgent(
      "Mozilla/5.0 AppleWebKit/605.1.15 Version/17.4 Safari/605.1.15",
    );

    render(<ExtensionInstallButtons variant="primary" onlyDetected />);

    expect(
      await screen.findByRole("button", {
        name: /safari support coming soon/i,
      }),
    ).toBeDisabled();
  });

  it("uses compact labels", async () => {
    setUserAgent("Mozilla/5.0 Gecko/20100101 Firefox/124.0");

    render(<ExtensionInstallButtons variant="compact" onlyDetected />);

    expect(
      await screen.findByRole("button", { name: /firefox soon/i }),
    ).toHaveClass("px-3");
  });
});
