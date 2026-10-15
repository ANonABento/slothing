import { existsSync } from "fs";
import { describe, expect, it } from "vitest";

import { fitResume, type Measure } from "../fit";
import { measureResume } from "../render";
import { typstBin } from "../render/run";
import { profileAsTailored, resolveResume } from "../resolve";
import { relevance, skillsByRelevance, terms } from "../score";
import { Profile, Settings, type TailoredResume } from "../types";

const layout = (patch: Partial<Settings["resume"]> = {}) => ({ ...Settings.parse({}).resume, ...patch });
const job = { title: "Robotics Software Engineer", description: "ROS 2, C++ and Python for robot perception. Real-time control loops, CUDA a plus." };

// Three roles, newest first, each with bullets of mixed relevance to the job above.
const profile = Profile.parse({
  experience: [
    {
      id: "r1",
      company: "Now Co",
      title: "Engineer",
      bullets: [
        { id: "r1a", text: "Planned the team offsite and ran the book club." },
        { id: "r1b", text: "Built ROS 2 perception nodes in C++ for robot arms." },
        { id: "r1c", text: "Wrote real-time control loops in Python and C++." },
      ],
    },
    {
      id: "r2",
      company: "Then Co",
      title: "Intern",
      bullets: [
        { id: "r2a", text: "Accelerated point-cloud filtering with CUDA kernels." },
        { id: "r2b", text: "Updated the marketing website copy." },
      ],
    },
    { id: "r3", company: "Old Co", title: "Cashier", bullets: [{ id: "r3a", text: "Handled the till and opened the store." }] },
  ],
  projects: [{ id: "p1", name: "Rover", bullets: [{ id: "p1a", text: "Python robot rover with ROS 2 navigation." }] }],
  skills: [{ id: "s1", category: "Languages", items: ["Java", "Python", "C++", "Go"] }],
});

/** A page holds `perPage` bullets; entries and the rest are free. */
const byCount =
  (perPage: number): Measure =>
  async (doc) => {
    const n = [...doc.experience, ...doc.projects].reduce((a, e) => a + e.bullets.length, 0);
    return { pages: Math.max(1, Math.ceil(n / perPage)), fill: (n % perPage) / perPage };
  };
const ids = (doc: TailoredResume) => [...doc.experience, ...doc.projects].flatMap((e) => e.bullets.flatMap((b) => b.sourceIds));

describe("scoring", () => {
  it("keeps tech spellings and folds plurals", () => {
    expect(terms("C++, C#, Node.js and the APIs")).toEqual(["c++", "c#", "node.js", "api"]);
    expect(terms("Robots use sensors")).toEqual(["robot", "sensor"]);
    expect(terms("C++ and C#")).toEqual(["c++", "c#"]);
  });

  it("ranks bullets that share the job's terms above ones that don't", () => {
    const score = relevance(`${job.title}\n${job.description}`, profile.experience.flatMap((e) => e.bullets.map((b) => b.text)));
    expect(score("Built ROS 2 perception nodes in C++ for robot arms.")).toBeGreaterThan(score("Planned the team offsite and ran the book club."));
    expect(score("Updated the marketing website copy.")).toBe(0);
  });

  it("puts skills the job mentions first", () => {
    expect(skillsByRelevance(["Java", "Python", "C++", "Go"], job.description)).toEqual(["Python", "C++", "Java", "Go"]);
  });
});

describe("fitResume", () => {
  it("fills the page with the most relevant bullets and keeps profile order on the page", async () => {
    const { doc, pages, overflow } = await fitResume(profile, job, profileAsTailored(profile), layout(), byCount(3));
    expect(pages).toBe(1);
    expect(overflow).toBe(false);
    expect(ids(doc).sort()).toEqual(["p1a", "r1b", "r1c"]);
    expect(ids(doc)).not.toContain("r1a");
    expect(ids(doc)).not.toContain("r3a");
    // Within a role, bullets keep the profile's order.
    const r1 = doc.experience.find((e) => e.sourceId === "r1")!;
    expect(r1.bullets.map((b) => b.sourceIds[0])).toEqual(["r1b", "r1c"]);
    expect(doc.skills[0].items.slice(0, 2)).toEqual(["Python", "C++"]);
  });

  it("includes everything when it all fits, or when there's no limit", async () => {
    const everything = ids(profileAsTailored(profile));
    expect(ids((await fitResume(profile, job, profileAsTailored(profile), layout(), byCount(100))).doc)).toHaveLength(everything.length);
    let measured = false;
    const res = await fitResume(profile, job, profileAsTailored(profile), layout({ pages: "any" }), async () => ((measured = true), { pages: 9, fill: 0 }));
    expect(ids(res.doc)).toHaveLength(everything.length);
    expect(measured).toBe(false);
  });

  it("pinned items go in first; hidden ones never", async () => {
    const ranked = Profile.parse({
      ...profile,
      experience: [
        { ...profile.experience[0], bullets: profile.experience[0].bullets.map((b) => (b.id === "r1b" ? { ...b, rank: "hidden" } : b)) },
        profile.experience[1],
        { ...profile.experience[2], rank: "pinned" },
      ],
    });
    const { doc } = await fitResume(ranked, job, profileAsTailored(ranked), layout(), byCount(2));
    expect(ids(doc)).toContain("r3a"); // pinned role, despite scoring zero
    expect(ids(doc)).not.toContain("r1b");
    expect(ids(doc)).toHaveLength(2);
  });

  it("reports overflow when pinned items alone don't fit", async () => {
    const allPinned = Profile.parse({ ...profile, experience: profile.experience.map((e) => ({ ...e, rank: "pinned" })) });
    const res = await fitResume(allPinned, job, profileAsTailored(allPinned), layout(), byCount(1));
    expect(res.overflow).toBe(true);
    expect(res.doc.experience.map((e) => e.sourceId)).toEqual(["r1", "r2", "r3"]);
  });

  it("an AI draft keeps its wording and order, and unused profile bullets fill the rest", async () => {
    const draft: TailoredResume = {
      summary: "",
      experience: [{ sourceId: "r2", bullets: [{ text: "CUDA-accelerated point clouds.", sourceIds: ["r2a"] }] }],
      projects: [],
      educationIds: [],
      skills: [],
    };
    const { doc } = await fitResume(profile, job, draft, layout(), byCount(3));
    expect(doc.experience.find((e) => e.sourceId === "r2")!.bullets[0].text).toBe("CUDA-accelerated point clouds.");
    expect(ids(doc)).toHaveLength(3);
    // The rest is filler, verbatim from the profile: the best-matching bullets the draft didn't use.
    expect(doc.experience.find((e) => e.sourceId === "r1")!.bullets).toEqual([{ text: "Wrote real-time control loops in Python and C++.", sourceIds: ["r1c"] }]);
  });

  it("leaves projects alone when the layout hides them", async () => {
    const draft = profileAsTailored(profile);
    // Hidden projects aren't on the page, so (like the real layout) this measure ignores them.
    const experienceOnly: Measure = async (d) => byCount(2)({ ...d, projects: [] });
    const { doc } = await fitResume(profile, job, draft, layout({ hide: ["projects"] }), experienceOnly);
    expect(doc.projects).toEqual(draft.projects);
    expect(doc.experience.flatMap((e) => e.bullets)).toHaveLength(2);
  });

  it("squeezes in a later bullet that still fits the gap", async () => {
    // A page holds 120 characters of bullets.
    const byChars: Measure = async (doc) => {
      const n = doc.experience.flatMap((e) => e.bullets).reduce((a, b) => a + b.text.length, 0);
      return { pages: n > 120 ? 2 : 1, fill: Math.min(1, n / 120) };
    };
    const { doc } = await fitResume(profile, job, profileAsTailored(profile), layout({ hide: ["projects"] }), byChars);
    const used = doc.experience.flatMap((e) => e.bullets).reduce((a, b) => a + b.text.length, 0);
    expect(used).toBeLessThanOrEqual(120);
    // Every bullet left out is too long for the space that's left.
    const left = profile.experience.flatMap((e) => e.bullets).filter((b) => !ids(doc).includes(b.id));
    expect(left.every((b) => used + b.text.length > 120)).toBe(true);
  });
});

describe("fitResume with real Typst layout", () => {
  it.skipIf(!existsSync(typstBin()))("fills exactly one page from a profile that runs to two", async () => {
    const long = Profile.parse({
      contact: { name: "Alex Rivera", email: "alex@example.com" },
      experience: Array.from({ length: 6 }, (_, r) => ({
        id: `r${r}`,
        company: `Company ${r}`,
        title: "Robotics Engineer",
        start: "2020",
        end: "2021",
        // Two lines each, so the whole profile runs well past one page.
        bullets: Array.from({ length: 6 }, (_, b) => ({
          id: `r${r}b${b}`,
          text: `Built ROS 2 and C++ perception pipelines for robot arm ${r}-${b}, improving real-time control loop stability across the fleet and cutting integration time for every new sensor the team brought online.`,
        })),
      })),
    });
    const before = await measureResume(resolveResume(profile, profileAsTailored(profile), layout()));
    expect(before.pages).toBe(1);
    const whole = await measureResume(resolveResume(long, profileAsTailored(long), layout()));
    expect(whole.pages).toBeGreaterThan(1);

    const { doc, pages, fill } = await fitResume(long, job, profileAsTailored(long), layout());
    expect(pages).toBe(1);
    expect(fill).toBeGreaterThan(0.85);
    const after = await measureResume(resolveResume(long, doc, layout()));
    expect(after.pages).toBe(1);
  }, 60_000);
});
