import { describe, expect, it, vi } from "vitest";

import {
  createErrorToast,
  getResponseErrorMessage,
  showErrorToast,
} from "./error-toast";

describe("error-toast", () => {
  it("builds an error toast from an Error instance", () => {
    expect(
      createErrorToast({
        title: "Couldn't load dashboard",
        error: new Error("Request timed out"),
      })
    ).toEqual({
      type: "error",
      title: "Couldn't load dashboard",
      description: "Request timed out",
    });
  });

  it("prefers an explicit description over the error message", () => {
    expect(
      createErrorToast({
        title: "Upload failed",
        error: new Error("Too much detail"),
        description: "Please try a different file.",
      })
    ).toEqual({
      type: "error",
      title: "Upload failed",
      description: "Please try a different file.",
    });
  });

  it("falls back when the error message is not useful", () => {
    expect(
      createErrorToast({
        title: "Couldn't load templates",
        error: { unexpected: true },
        fallbackDescription: "Please refresh and try again.",
      })
    ).toEqual({
      type: "error",
      title: "Couldn't load templates",
      description: "Please refresh and try again.",
    });
  });

  it("passes the generated toast to addToast", () => {
    const addToast = vi.fn();

    showErrorToast(addToast, {
      title: "Couldn't delete source file",
      error: "Permission denied",
    });

    expect(addToast).toHaveBeenCalledWith({
      type: "error",
      title: "Couldn't delete source file",
      description: "Permission denied",
    });
  });

  it("extracts API error text from a response body", () => {
    expect(
      getResponseErrorMessage(
        { error: "Template service unavailable" },
        "Failed to load templates"
      )
    ).toBe("Template service unavailable");
  });

  it("falls back when an API response body has no usable message", () => {
    expect(
      getResponseErrorMessage(
        { status: "bad" },
        "Failed to generate preview"
      )
    ).toBe("Failed to generate preview");
  });

  it("builds an error toast from a string error", () => {
    expect(
      createErrorToast({
        title: "Couldn't delete notification",
        error: "Permission denied",
      })
    ).toEqual({
      type: "error",
      title: "Couldn't delete notification",
      description: "Permission denied",
    });
  });

  it("uses fallbackDescription when error is omitted", () => {
    expect(
      createErrorToast({
        title: "Couldn't load jobs",
        fallbackDescription: "Please refresh and try again.",
      })
    ).toEqual({
      type: "error",
      title: "Couldn't load jobs",
      description: "Please refresh and try again.",
    });
  });

  it("omits description entirely when no error or fallback is supplied", () => {
    expect(
      createErrorToast({
        title: "Upload failed",
      })
    ).toEqual({
      type: "error",
      title: "Upload failed",
    });
  });

  it("prefers fallbackDescription when error message is the generic fallback", () => {
    // getErrorMessage returns "An unexpected error occurred" for non-Error, non-string,
    // non-messagable objects — we must fall through to fallbackDescription instead of
    // showing the generic string to the user.
    const addToast = vi.fn();
    showErrorToast(addToast, {
      title: "Couldn't load drafts",
      error: { weird: "shape" },
      fallbackDescription: "Please refresh and try again.",
    });

    expect(addToast).toHaveBeenCalledWith({
      type: "error",
      title: "Couldn't load drafts",
      description: "Please refresh and try again.",
    });
  });

  it("extracts message field from API response body when error is absent", () => {
    expect(
      getResponseErrorMessage(
        { message: "Quota exceeded" },
        "Failed to send email"
      )
    ).toBe("Quota exceeded");
  });

  it("prefers error field over message when both are present", () => {
    expect(
      getResponseErrorMessage(
        { error: "Bad request", message: "Unused" },
        "Fallback"
      )
    ).toBe("Bad request");
  });

  it("falls back for null or non-object response bodies", () => {
    expect(getResponseErrorMessage(null, "fallback")).toBe("fallback");
    expect(getResponseErrorMessage("string body", "fallback")).toBe("fallback");
    expect(getResponseErrorMessage(undefined, "fallback")).toBe("fallback");
  });
});
