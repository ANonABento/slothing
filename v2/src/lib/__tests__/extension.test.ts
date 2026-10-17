import { describe, expect, it } from "vitest";

import * as db from "../db";
import { applied, saveJob, seen } from "../extension";

const posting = (id: string) => ({
  url: `https://careers.example.com/jobs/${id}`,
  title: "Data Analyst – Example",
  text: "",
  html: `<script type="application/ld+json">${JSON.stringify({
    "@type": "JobPosting",
    title: `Data Analyst ${id}`,
    hiringOrganization: { name: "Example Co" },
    description: "<p>Analyse demand. ".repeat(20) + "</p>",
  })}</script>`,
});

describe("seen → saved → applied", () => {
  it("records a posting you open as seen, then remembers you've seen it", async () => {
    const first = await seen(posting("a1"));
    expect(first.job).toMatchObject({ status: "seen", title: "Data Analyst a1", company: "Example Co" });
    expect(first.before).toBeNull();
    const again = await seen({ ...posting("a1"), url: "https://careers.example.com/jobs/a1/apply" });
    expect(again.job?.id).toBe(first.job?.id);
    expect(again.before).toBeTruthy();
    expect(db.listJobs().filter((j) => j.title === "Data Analyst a1")).toHaveLength(1);
  });

  it("doesn't record anything with auto-save off", async () => {
    const s = db.getSettings();
    db.saveSettings({ ...s, extension: { autoSave: false } });
    expect((await seen(posting("a2"))).job).toBeNull();
    db.saveSettings(s);
  });

  it("saving a seen posting moves it to your jobs; applying records the answers", async () => {
    const { job } = await seen(posting("a3"));
    const saved = await saveJob(posting("a3"));
    expect(saved).toMatchObject({ created: true, job: { id: job!.id, status: "saved" } });
    const r = applied({
      jobId: job!.id,
      url: "https://careers.example.com/jobs/a3/apply",
      fields: [
        { id: "1", kind: "text", label: "First name", value: "Alex" },
        { id: "2", kind: "textarea", label: "Why us?", value: "Because." },
        { id: "3", kind: "file", label: "Resume", value: "cv.pdf" },
        { id: "4", kind: "text", label: "Website", value: "" },
      ],
    });
    expect(r.job).toMatchObject({ status: "applied", appliedAt: expect.any(String) });
    expect(db.listApplications(job!.id)[0].answers).toEqual([
      { question: "First name", answer: "Alex" },
      { question: "Why us?", answer: "Because." },
    ]);
  });
});
