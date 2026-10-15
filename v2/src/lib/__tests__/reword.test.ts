import { beforeEach, describe, expect, it, vi } from "vitest";

import { generateJSON } from "../llm";
import { citedSources, rewordBullet } from "../tailor";
import { profile } from "./fixture";

vi.mock("../llm", () => ({ generateJSON: vi.fn() }));
const llm = vi.mocked(generateJSON);

const job = { title: "Staff Engineer", company: "Initech", description: "CI, GraphQL, TypeScript" };
const bullet = { text: profile.experience[0].bullets[0].text, sourceIds: ["b1"] };

beforeEach(() => llm.mockReset());

describe("rewordBullet", () => {
  it("sends only the cited bullets and the hint", async () => {
    llm.mockResolvedValue({ alternatives: ["Parallelised tests over 12 runners, cutting CI time 40%."] });
    await rewordBullet(profile, job, bullet, "lead with the result");
    const user = llm.mock.calls[0][2];
    expect(user).toContain(profile.experience[0].bullets[0].text);
    expect(user).not.toContain(profile.experience[0].bullets[1].text);
    expect(user).toContain("Hint: lead with the result");
  });

  it("flags numbers the source doesn't state, and drops repeats of the current text", async () => {
    llm.mockResolvedValue({
      alternatives: ["- Cut CI time by 60% with 12 parallel runners.", bullet.text, "Cut CI time 40% across 12 runners.", "Cut CI time 40% across 12 runners.", ""],
    });
    const out = await rewordBullet(profile, job, bullet, "");
    expect(out).toEqual([
      { text: "Cut CI time by 60% with 12 parallel runners.", warning: "Mentions 60%, which isn't in the source bullet." },
      { text: "Cut CI time 40% across 12 runners." },
    ]);
  });

  it("refuses a bullet with no source in the profile", async () => {
    await expect(rewordBullet(profile, job, { text: "x", sourceIds: ["nope"] }, "")).rejects.toThrow(/doesn't cite/);
    expect(llm).not.toHaveBeenCalled();
  });
});

describe("citedSources", () => {
  it("names the entry and keeps profile order", () => {
    expect(citedSources(profile, ["b2", "b1"])).toEqual({
      heading: "Senior Software Engineer at Acme & Co",
      bullets: profile.experience[0].bullets.map((b) => b.text),
    });
  });
});
