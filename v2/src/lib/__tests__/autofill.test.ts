import { describe, expect, it } from "vitest";

import { FormField, classify, countryOf, planFill, profileValue, proposeAnswers } from "../autofill";
import { Profile, type Answer } from "../types";
import { profile } from "./fixture";

const field = (id: string, label: string, extra: Partial<FormField> = {}): FormField => FormField.parse({ id, kind: "text", label, ...extra });

const saved = (id: string, question: string, answer: string): Answer => ({
  id,
  question,
  answer,
  sourceUrl: "",
  uses: 0,
  usedAt: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});

describe("classify", () => {
  const cases: [Partial<FormField> & { label: string }, string][] = [
    [{ label: "First Name *" }, "firstName"],
    [{ label: "Last name" }, "lastName"],
    [{ label: "Name" }, "fullName"],
    [{ label: "Preferred name" }, "question"],
    [{ label: "Company name" }, "currentCompany"],
    [{ label: "Email", kind: "email" }, "email"],
    [{ label: "Confirm your email" }, "question"],
    [{ label: "Phone" }, "phone"],
    [{ label: "LinkedIn Profile" }, "linkedin"],
    [{ label: "GitHub URL" }, "github"],
    [{ label: "Website" }, "website"],
    [{ label: "Portfolio link" }, "website"],
    [{ label: "Current company" }, "currentCompany"],
    [{ label: "Please provide the name of your current (or most recent) company" }, "currentCompany"],
    [{ label: "Current location" }, "location"],
    [{ label: "What is your location?" }, "location"],
    [{ label: "Are you willing to relocate?" }, "question"],
    [{ label: "", name: "job_application[first_name]" }, "firstName"],
    [{ label: "", autocomplete: "family-name" }, "lastName"],
    [{ label: "Why do you want to join us?", kind: "textarea" }, "question"],
  ];
  it.each(cases)("%o → %s", (f, expected) => {
    const role = classify(field("x", f.label, f));
    expect(role.type === "profile" ? role.key : role.type).toBe(expected);
  });

  it("never reads a dropdown as an identity field", () => {
    expect(classify(field("p", "Phone", { kind: "select", options: ["+1", "+44"] }))).toEqual({ type: "question" });
    expect(classify(field("c", "Current location", { kind: "select" }))).toEqual({ type: "profile", key: "location" });
  });

  it("sorts file inputs into resume and cover letter", () => {
    expect(classify(field("f", "Attach", { kind: "file", name: "cover_letter" }))).toEqual({ type: "file", doc: "letter" });
    expect(classify(field("f", "Autofill from resume", { kind: "file" }))).toEqual({ type: "ignore" });
    expect(classify(field("f", "Resume/CV", { kind: "file" }))).toEqual({ type: "file", doc: "resume" });
    expect(classify(field("f", "Cover Letter", { kind: "file" }))).toEqual({ type: "file", doc: "letter" });
    expect(classify(field("f", "Transcript", { kind: "file" }))).toEqual({ type: "question" });
  });
});

describe("profileValue", () => {
  const nurse = Profile.parse({ contact: { name: "Dana Smith, BSN, RN", links: [{ label: "LinkedIn", url: "linkedin.com/in/dana" }, { label: "", url: "dana.dev" }] }, experience: [{ id: "e", company: "Mercy", title: "RN", end: "Present" }] });
  it("drops credentials from the name and splits it", () => {
    expect(profileValue(nurse, "fullName")).toBe("Dana Smith");
    expect(profileValue(nurse, "firstName")).toBe("Dana");
    expect(profileValue(nurse, "lastName")).toBe("Smith");
  });
  it("finds links by site and adds a scheme", () => {
    expect(profileValue(nurse, "linkedin")).toBe("https://linkedin.com/in/dana");
    expect(profileValue(nurse, "website")).toBe("https://dana.dev");
    expect(profileValue(nurse, "github")).toBe("");
  });
  it("uses the current role only", () => {
    expect(profileValue(nurse, "currentCompany")).toBe("Mercy");
    expect(profileValue(profile, "currentCompany")).toBe("Acme & Co");
    expect(profileValue(Profile.parse({ experience: [{ id: "e", company: "Old", title: "x", end: "2020" }] }), "currentCompany")).toBe("");
  });
  it("takes the city from the location", () => expect(profileValue(profile, "city")).toBe("Toronto"));
});

describe("planFill", () => {
  const bank = [
    saved("a1", "Are you authorized to work in the US?", "Yes"),
    saved("a2", "How did you hear about us?", "LinkedIn"),
    saved("a3", "When can you start?", ""),
    saved("a4", "Will you require visa sponsorship?", "No"),
  ];
  const fields = [
    field("1", "First name"),
    field("2", "Email", { kind: "email", value: "typed@me.com" }),
    field("3", "Are you legally authorized to work in the United States?", { kind: "select", options: ["Yes, I am", "No"] }),
    field("4", "How did you hear about this job?", { kind: "radio", options: ["Referral", "Job board"] }),
    field("5", "When could you start?"),
    field("6", "Resume", { kind: "file" }),
    field("7", "Cover letter", { kind: "file" }),
    field("8", "GitHub"),
  ];
  const plan = planFill(fields, profile, bank, { resume: true, letter: false });
  const fill = (id: string) => plan.fills.find((f) => f.id === id);
  const skip = (id: string) => plan.skipped.find((s) => s.id === id)?.reason;

  it("fills identity fields from the profile and keeps what's typed", () => {
    expect(fill("1")).toEqual({ id: "1", source: "profile", value: "Alex" });
    expect(skip("2")).toBe("has-value");
    expect(fill("8")).toMatchObject({ value: "https://github.com/alexr" });
  });
  it("answers questions from the bank, picking the matching option", () => {
    expect(fill("3")).toEqual({ id: "3", source: "bank", value: "Yes, I am", option: 0, answerId: "a1" });
    expect(skip("4")).toBe("no-option");
    expect(skip("5")).toBe("no-answer");
  });
  it("passes the answer through for a searchable dropdown, whose options the page finds", () => {
    const p = planFill([field("s", "Do you require sponsorship?", { kind: "select" })], profile, bank, { resume: false, letter: false });
    expect(p.fills).toEqual([{ id: "s", source: "bank", value: "No", option: undefined, answerId: "a4" }]);
  });
  it("doesn't paste an answer written for another company", () => {
    const b = [saved("w", "Why do you want to work in our ICU?", "The patients at Lakeside Health are who I know best.")];
    const p = planFill([field("q", "Why do you want to work in our ICU?")], profile, b, { resume: false, letter: false }, ["Lakeside Health", "Acme"]);
    expect(p.skipped).toEqual([{ id: "q", reason: "other-company", company: "Lakeside Health" }]);
    expect(planFill([field("q", "Why do you want to work in our ICU?")], profile, b, { resume: false, letter: false }, ["Acme"]).fills).toHaveLength(1);
  });
  it("leaves other uploads to you", () => {
    expect(planFill([field("t", "Transcript", { kind: "file" })], profile, bank, { resume: true, letter: true }).skipped).toEqual([{ id: "t", reason: "upload" }]);
  });
  it("attaches only documents the job has", () => {
    expect(fill("6")).toEqual({ id: "6", source: "file", doc: "resume" });
    expect(skip("7")).toBe("no-document");
  });
});

describe("proposeAnswers", () => {
  const bank = [saved("a1", "When can you start?", ""), saved("a2", "How did you hear about us?", "LinkedIn")];
  it("offers new answers and fills blank saved questions, but not identity fields or unchanged answers", () => {
    const out = proposeAnswers(
      [
        field("1", "First name", { value: "Alex" }),
        field("2", "When could you start?", { value: "In two weeks" }),
        field("3", "How did you hear about us?", { kind: "select", options: ["LinkedIn"], value: "LinkedIn" }),
        field("4", "Why us?", { kind: "textarea", value: "Because." }),
        field("5", "Why us?", { kind: "textarea", value: "Again." }),
      ],
      bank,
    );
    expect(out).toEqual([
      { fieldId: "2", question: "When could you start?", answer: "In two weeks", status: "update", replaces: { id: "a1", answer: "" } },
      { fieldId: "4", question: "Why us?", answer: "Because.", status: "new" },
    ]);
  });
});

describe("countries", () => {
  it("a location's country: US states and Canadian provinces by code or name, else the last part as written", () => {
    expect(countryOf("Chicago, IL")).toBe("United States");
    expect(countryOf("Austin, Texas")).toBe("United States");
    expect(countryOf("Brooklyn, New York")).toBe("United States");
    expect(countryOf("Toronto, ON")).toBe("Canada");
    expect(countryOf("Berlin, Germany")).toBe("Germany");
    expect(countryOf("London, UK")).toBe("United Kingdom");
    expect(countryOf("Chicago")).toBe("");
  });

  it("a country field, a dropdown that names it differently, and a location dropdown of countries", () => {
    const p = Profile.parse({ ...profile, contact: { ...profile.contact, location: "Chicago, IL" } });
    expect(classify(field("c", "Country", { kind: "select" }))).toEqual({ type: "profile", key: "country" });
    expect(classify(field("c", "What is your current country of residence?", { kind: "select" }))).toEqual({ type: "profile", key: "country" });
    expect(classify(field("c", "Country code", { kind: "select" })).type).toBe("question");
    const plan = planFill(
      [
        field("a", "Country", { kind: "select", options: ["Select…", "Canada", "United States of America"] }),
        field("b", "What is your location?", { kind: "select", options: ["Afghanistan", "USA", "Zambia"] }),
      ],
      p,
      [],
      { resume: false, letter: false },
    );
    expect(plan.fills).toEqual([
      { id: "a", source: "profile", value: "United States of America", option: 2 },
      { id: "b", source: "profile", value: "USA", option: 1 },
    ]);
  });
});

describe("letter and summary text boxes", () => {
  it("a cover letter box gets the letter's text; without a letter it's left for you", () => {
    const box = field("l", "Cover letter", { kind: "textarea" });
    expect(classify(box)).toEqual({ type: "letter" });
    expect(planFill([box], profile, [], { resume: false, letter: true, letterText: "Dear team,\n\nHello." }).fills).toEqual([{ id: "l", source: "letter", value: "Dear team,\n\nHello." }]);
    expect(planFill([box], profile, [], { resume: false, letter: false }).skipped).toEqual([{ id: "l", reason: "no-document" }]);
    // A question about letters isn't the letter.
    expect(classify(field("q", "Is there anything you'd like to add that isn't in your cover letter or resume?", { kind: "textarea" })).type).toBe("question");
  });

  it("a summary box gets the profile summary", () => {
    expect(planFill([field("s", "Summary", { kind: "textarea" })], profile, [], { resume: false, letter: false }).fills).toEqual([{ id: "s", source: "profile", value: profile.summary }]);
  });
});
