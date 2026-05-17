/**
 * Realistic-resume scenarios. Each test builds a synthetic
 * `PdfPositionItem[]` that mirrors what pdf.js emits for a typical
 * single- or multi-page resume layout, then runs the production matcher
 * against the needles a parser would derive.
 *
 * These exist because manual testing on Kevin's master resume surfaced
 * inconsistencies — some project titles + bullets matched, others on
 * the same page didn't. Reproducing the failures here in synthetic data
 * gives us a fast feedback loop while we iterate on the matcher.
 */

import { describe, expect, it } from "vitest";

import {
  deriveSearchNeedle,
  findPositionsForText,
  type PdfPositionItem,
} from "./pdf-positions";

// ---------- Helpers to build resume-like PdfPositionItem[] ----------

interface BuiltItem {
  text: string;
  x: number;
  y?: number;
  width?: number;
}

function lineItems(
  page: number,
  y: number,
  segments: BuiltItem[],
  height = 11,
): PdfPositionItem[] {
  return segments.map((seg) => ({
    text: seg.text,
    page,
    x0: seg.x,
    y0: y,
    x1: seg.x + (seg.width ?? seg.text.length * 5.5),
    y1: y + height,
  }));
}

/**
 * Build a realistic project block: title row with tech-stack separators,
 * a link emoji, plus N bullets. Returns the items + the needles that
 * would be derived for the parsed entries (project + each bullet).
 */
function projectBlock(
  page: number,
  startY: number,
  name: string,
  techStack: string[],
  bullets: string[],
): {
  items: PdfPositionItem[];
  projectNeedle: string;
  bulletNeedles: string[];
} {
  const items: PdfPositionItem[] = [];
  let y = startY;

  // Title row: "Name | Tech | Tech | Tech 🔗"
  // pdf.js usually emits the title, each `| Tech` as separate runs, and
  // the link emoji as its own item.
  const titleSegs: BuiltItem[] = [{ text: name, x: 72 }];
  let x = 72 + name.length * 6;
  for (const tech of techStack) {
    titleSegs.push({ text: "|", x });
    x += 8;
    titleSegs.push({ text: tech, x });
    x += tech.length * 5.5;
  }
  titleSegs.push({ text: "🔗", x });
  items.push(...lineItems(page, y, titleSegs));
  y += 14;

  // Bullets
  const bulletNeedles: string[] = [];
  for (const bullet of bullets) {
    bulletNeedles.push(bullet);
    // pdf.js often splits long bullets across the bullet glyph + N words.
    // Simulate: "•" then 2-3 word fragments.
    const segs: BuiltItem[] = [{ text: "•", x: 80 }];
    const words = bullet.split(" ");
    let xx = 92;
    for (let i = 0; i < words.length; i += 3) {
      const frag = words.slice(i, i + 3).join(" ");
      segs.push({ text: frag, x: xx });
      xx += frag.length * 5.5 + 4;
    }
    items.push(...lineItems(page, y, segs));
    y += 13;
  }

  return { items, projectNeedle: name, bulletNeedles };
}

function experienceBlock(
  page: number,
  startY: number,
  title: string,
  company: string,
  location: string,
  dates: string,
  bullets: string[],
): {
  items: PdfPositionItem[];
  experienceNeedle: string;
  bulletNeedles: string[];
} {
  const items: PdfPositionItem[] = [];
  let y = startY;

  // Header: "Title — Company — Location  ...  Dates"
  items.push(
    ...lineItems(page, y, [
      { text: title, x: 72 },
      { text: "—", x: 72 + title.length * 6 + 4 },
      { text: company, x: 72 + title.length * 6 + 16 },
      { text: "—", x: 72 + title.length * 6 + 16 + company.length * 6 + 4 },
      {
        text: location,
        x: 72 + title.length * 6 + 16 + company.length * 6 + 16,
      },
      { text: dates, x: 480 }, // right-aligned
    ]),
  );
  y += 14;

  const bulletNeedles: string[] = [];
  for (const bullet of bullets) {
    bulletNeedles.push(bullet);
    const segs: BuiltItem[] = [{ text: "•", x: 80 }];
    const words = bullet.split(" ");
    let xx = 92;
    for (let i = 0; i < words.length; i += 3) {
      const frag = words.slice(i, i + 3).join(" ");
      segs.push({ text: frag, x: xx });
      xx += frag.length * 5.5 + 4;
    }
    items.push(...lineItems(page, y, segs));
    y += 13;
  }

  return {
    items,
    experienceNeedle: `${title} ${company}`, // mirrors deriveSearchNeedle('experience')
    bulletNeedles,
  };
}

// ---------- Tests ----------

describe("realistic resume scenarios (universal coverage)", () => {
  it("matches every project title + bullet on a single dense page", () => {
    const allItems: PdfPositionItem[] = [];
    const needles: { kind: string; needle: string }[] = [];

    // Header
    allItems.push(
      ...lineItems(1, 80, [
        { text: "Kevin Jiang", x: 72, width: 200 },
        { text: "k69jiang@uwaterloo.ca", x: 480 },
      ]),
    );

    // EDUCATION
    allItems.push(...lineItems(1, 120, [{ text: "EDUCATION", x: 72 }]));
    allItems.push(
      ...lineItems(1, 140, [
        { text: "University of Waterloo", x: 72 },
        { text: "BASc in Computer Engineering", x: 220 },
        { text: "Sept 2024 - Present", x: 460 },
      ]),
    );
    needles.push({
      kind: "education",
      needle: deriveSearchNeedle("education", {
        institution: "University of Waterloo",
        degree: "BASc",
        field: "Computer Engineering",
      }),
    });

    // EXPERIENCE
    allItems.push(...lineItems(1, 180, [{ text: "EXPERIENCE", x: 72 }]));

    const exp1 = experienceBlock(
      1,
      200,
      "Robotics Engineering",
      "Reazon Human Interaction Lab",
      "Tokyo, Japan",
      "Jun 2025 — Aug 2025",
      [
        "Designed a lightweight exoskeleton wrist controller in Fusion 360 for an 8-DOF robotic arm puppeteer system",
        "Tracked wrist-mounted magnetic AprilTags using dual cameras and ROS 2 for real-time remote teleoperation",
      ],
    );
    allItems.push(...exp1.items);
    needles.push({ kind: "experience", needle: exp1.experienceNeedle });
    for (const b of exp1.bulletNeedles) {
      needles.push({ kind: "bullet", needle: b });
    }

    // PROJECTS
    allItems.push(...lineItems(1, 320, [{ text: "PROJECTS", x: 72 }]));

    const projects = [
      {
        name: "Full-Stack AI Assistant Platform",
        tech: ["Next.js", "React", "TypeScript", "TailwindCSS", "Prisma"],
        bullets: [
          "Built a full-stack AI productivity assistant platform with Next.js and a serverless backend",
          "Designed a modular widget-based dashboard with calendar notes and tasks images",
        ],
      },
      {
        name: "Expressive Animatronic Head",
        tech: ["Python", "PyTorch", "ROS2", "ESP32", "Fusion 360"],
        bullets: [
          "Integrated Silero VAD Whisper STT llama cpp and Zonos TTS for real-time speech",
          "Enabled AI-driven servo control for expressive behaviors with waveform-driven lip-sync",
        ],
      },
      {
        name: "AR Gesture Controlled Robot",
        tech: ["Javascript", "Python", "ROS2", "Jetson Nano", "Docker"],
        bullets: [
          "Built a modular 2-wheel drive robot platform with a 3-DOF arm on Nvidia Jetson Nano",
          "Enabled control through Snapchat AR glasses with real-time gesture input on a Flask dashboard",
        ],
      },
      {
        name: "Object Labelling Android App",
        tech: ["Java", "Android Studio", "ML Kit"],
        bullets: [
          "Implemented Google ML Kit in an Android app for real-time image labeling",
        ],
      },
    ];

    let projY = 340;
    for (const p of projects) {
      const block = projectBlock(1, projY, p.name, p.tech, p.bullets);
      allItems.push(...block.items);
      needles.push({ kind: "project", needle: block.projectNeedle });
      for (const b of block.bulletNeedles) {
        needles.push({ kind: "bullet", needle: b });
      }
      projY += 14 + p.bullets.length * 13 + 8;
    }

    // ---- Now match every needle ----
    const results = needles.map((n) => {
      const bboxes = findPositionsForText(n.needle, allItems);
      return { ...n, matched: bboxes.length > 0, bboxes };
    });

    const misses = results.filter((r) => !r.matched);
    if (misses.length > 0) {
      // Pretty-print so the failure message tells us which kinds fail.
      // eslint-disable-next-line no-console
      console.error(
        "Missed needles:\n" +
          misses
            .map((m) => `  [${m.kind}] "${m.needle.slice(0, 80)}"`)
            .join("\n"),
      );
    }
    expect(misses.map((m) => `${m.kind}: ${m.needle.slice(0, 40)}`)).toEqual(
      [],
    );
  });

  it("matches all entries when the resume spans two pages", () => {
    const allItems: PdfPositionItem[] = [];
    const needles: { kind: string; needle: string }[] = [];

    // Page 1 — fills naturally
    let y = 100;
    const page1Projects = [
      {
        name: "Full-Stack AI Assistant Platform",
        tech: ["Next.js", "React"],
        bullets: [
          "Built a full-stack AI productivity assistant platform with Next.js",
        ],
      },
      {
        name: "Expressive Animatronic Head",
        tech: ["Python", "PyTorch"],
        bullets: [
          "Integrated Silero VAD Whisper STT and llama cpp for real-time speech",
        ],
      },
    ];
    for (const p of page1Projects) {
      const block = projectBlock(1, y, p.name, p.tech, p.bullets);
      allItems.push(...block.items);
      needles.push({ kind: "project", needle: block.projectNeedle });
      for (const b of block.bulletNeedles) {
        needles.push({ kind: "bullet", needle: b });
      }
      y += 14 + p.bullets.length * 13 + 8;
    }

    // Page 2 — same kinds of projects, starts y=100 again
    let y2 = 100;
    const page2Projects = [
      {
        name: "Facial Recognition Alarm",
        tech: ["C#", "STM32"],
        bullets: [
          "Developed an autonomous flywheel turret on a Raspberry Pi with a 2-DOF motorized tracking system",
        ],
      },
      {
        name: "Augmented Communication Device",
        tech: ["C", "STM32"],
        bullets: [
          "Engineered a low-cost wrist-mounted texting device featuring modular 3D-printed housing",
        ],
      },
    ];
    for (const p of page2Projects) {
      const block = projectBlock(2, y2, p.name, p.tech, p.bullets);
      allItems.push(...block.items);
      needles.push({ kind: "project", needle: block.projectNeedle });
      for (const b of block.bulletNeedles) {
        needles.push({ kind: "bullet", needle: b });
      }
      y2 += 14 + p.bullets.length * 13 + 8;
    }

    const results = needles.map((n) => ({
      ...n,
      bboxes: findPositionsForText(n.needle, allItems),
    }));

    const misses = results.filter((r) => r.bboxes.length === 0);
    if (misses.length > 0) {
      // eslint-disable-next-line no-console
      console.error(
        "Multi-page misses:\n" +
          misses
            .map((m) => `  [${m.kind}] "${m.needle.slice(0, 80)}"`)
            .join("\n"),
      );
    }
    expect(misses).toEqual([]);

    // Each project should match its OWN page, not someone else's.
    for (const r of results) {
      if (r.kind !== "project") continue;
      const pages = new Set(r.bboxes.map((b) => b[0]));
      expect(
        pages.size,
        `${r.needle} matched on multiple pages: ${[...pages]}`,
      ).toBe(1);
    }
  });

  it("does not bleed: a project title's match doesn't drift onto another project's row", () => {
    const allItems: PdfPositionItem[] = [];
    let y = 100;
    const block1 = projectBlock(
      1,
      y,
      "AR Gesture Controlled Robot",
      ["Javascript", "Python"],
      [],
    );
    allItems.push(...block1.items);
    y += 30;

    const block2 = projectBlock(
      1,
      y,
      "Object Labelling Android App",
      ["Java", "ML Kit"],
      [],
    );
    allItems.push(...block2.items);

    const bboxes = findPositionsForText(
      "AR Gesture Controlled Robot",
      allItems,
    );
    expect(bboxes).toHaveLength(1);
    // Match must stay on the first project's row (y=100), not extend to row 2.
    expect(bboxes[0][2]).toBeLessThan(120);
  });
});
