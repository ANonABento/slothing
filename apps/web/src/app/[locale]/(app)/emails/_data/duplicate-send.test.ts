import { describe, expect, it } from "vitest";
import {
  extractEmailAddress,
  findRecentDuplicateSend,
  type DuplicateCandidateSend,
} from "./duplicate-send";

const NOW = Date.UTC(2026, 4, 10, 12, 0, 0);
const DAY = 24 * 60 * 60 * 1000;

function send(
  overrides: Partial<DuplicateCandidateSend> = {},
): DuplicateCandidateSend {
  return {
    id: "send-1",
    type: "cold_outreach",
    recipient: "john@acme.com",
    sentAt: new Date(NOW - 2 * DAY).toISOString(),
    ...overrides,
  };
}

describe("extractEmailAddress", () => {
  it.each([
    ["john@acme.com", "john@acme.com"],
    ["  John@Acme.COM  ", "john@acme.com"],
    ["John Doe <john@acme.com>", "john@acme.com"],
    ['"John Doe" <John@Acme.com>', "john@acme.com"],
    ["John <john+work@acme.com>", "john+work@acme.com"],
    ["", ""],
    ["   ", ""],
  ])("normalizes %j to %j", (input, expected) => {
    expect(extractEmailAddress(input)).toBe(expected);
  });

  it("does not validate non-email text before comparing", () => {
    expect(extractEmailAddress("not an email")).toBe("not an email");
  });
});

describe("findRecentDuplicateSend", () => {
  it("returns null when there are no sends", () => {
    expect(
      findRecentDuplicateSend([], {
        type: "cold_outreach",
        recipient: "john@acme.com",
        windowDays: 14,
        now: NOW,
      }),
    ).toBeNull();
  });

  it("returns null for a blank recipient", () => {
    expect(
      findRecentDuplicateSend([send()], {
        type: "cold_outreach",
        recipient: "   ",
        windowDays: 14,
        now: NOW,
      }),
    ).toBeNull();
  });

  it("returns null when the only matching send is outside the window", () => {
    expect(
      findRecentDuplicateSend(
        [send({ sentAt: new Date(NOW - 20 * DAY).toISOString() })],
        {
          type: "cold_outreach",
          recipient: "john@acme.com",
          windowDays: 14,
          now: NOW,
        },
      ),
    ).toBeNull();
  });

  it("returns an in-window send to the same recipient and type", () => {
    const duplicate = send();

    expect(
      findRecentDuplicateSend([duplicate], {
        type: "cold_outreach",
        recipient: "john@acme.com",
        windowDays: 14,
        now: NOW,
      }),
    ).toBe(duplicate);
  });

  it("matches a stored display-name recipient against a plain typed email", () => {
    const duplicate = send({ recipient: "John Doe <john@acme.com>" });

    expect(
      findRecentDuplicateSend([duplicate], {
        type: "cold_outreach",
        recipient: "john@acme.com",
        windowDays: 14,
        now: NOW,
      }),
    ).toBe(duplicate);
  });

  it("matches a plain stored email against a typed display-name recipient", () => {
    const duplicate = send();

    expect(
      findRecentDuplicateSend([duplicate], {
        type: "cold_outreach",
        recipient: "John Doe <john@acme.com>",
        windowDays: 14,
        now: NOW,
      }),
    ).toBe(duplicate);
  });

  it("returns null for a different template type", () => {
    expect(
      findRecentDuplicateSend([send({ type: "thank_you" })], {
        type: "cold_outreach",
        recipient: "john@acme.com",
        windowDays: 14,
        now: NOW,
      }),
    ).toBeNull();
  });

  it("returns null for a different recipient domain", () => {
    expect(
      findRecentDuplicateSend([send({ recipient: "john@example.com" })], {
        type: "cold_outreach",
        recipient: "john@acme.com",
        windowDays: 14,
        now: NOW,
      }),
    ).toBeNull();
  });

  it("returns the first matching send", () => {
    const first = send({ id: "send-1" });
    const second = send({ id: "send-2" });

    expect(
      findRecentDuplicateSend([first, second], {
        type: "cold_outreach",
        recipient: "john@acme.com",
        windowDays: 14,
        now: NOW,
      }),
    ).toBe(first);
  });

  it("skips malformed sent dates and keeps scanning", () => {
    const duplicate = send({ id: "send-2" });

    expect(
      findRecentDuplicateSend(
        [send({ id: "send-1", sentAt: "not-a-date" }), duplicate],
        {
          type: "cold_outreach",
          recipient: "john@acme.com",
          windowDays: 14,
          now: NOW,
        },
      ),
    ).toBe(duplicate);
  });
});
