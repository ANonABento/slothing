import { describe, it, expect } from "vitest";
import { navigationGroups, bottomNavigation } from "./sidebar";

describe("navigationGroups", () => {
  it("should include all sidebar groups", () => {
    const labels = navigationGroups.map((g) => g.label);
    expect(labels).toEqual([
      "Overview",
      "Resume",
      "Job Tracker",
      "Interview",
      "Negotiation",
      "Insights",
    ]);
  });

  it("should have Dashboard in Overview group", () => {
    const overview = navigationGroups.find((g) => g.label === "Overview");
    expect(overview).toBeDefined();
    const names = overview!.items.map((i) => i.name);
    expect(names).toContain("Dashboard");
  });

  it("should have Documents and Document Studio in Resume group", () => {
    const resume = navigationGroups.find((g) => g.label === "Resume");
    expect(resume).toBeDefined();
    const names = resume!.items.map((i) => i.name);
    expect(names).toContain("Documents");
    expect(names).toContain("Document Studio");
  });

  it("should show one Document Studio link instead of separate document routes", () => {
    const resume = navigationGroups.find((g) => g.label === "Resume");
    expect(resume).toBeDefined();
    const names = resume!.items.map((i) => i.name);
    expect(names).toContain("Document Studio");
    expect(names).not.toContain("Resume Builder");
    expect(names).not.toContain("Tailor Resume");
    expect(names).not.toContain("Cover Letter");
  });

  it("should have Interview Prep in Interview group", () => {
    const interview = navigationGroups.find((g) => g.label === "Interview");
    expect(interview).toBeDefined();
    const interviewPrep = interview!.items.find((i) => i.name === "Interview Prep");
    expect(interviewPrep).toBeDefined();
    expect(interviewPrep!.href).toBe("/interview");
    expect(interviewPrep!.icon).toBeDefined();
  });

  it("should have job tracker items in Job Tracker group", () => {
    const jobTracker = navigationGroups.find((g) => g.label === "Job Tracker");
    expect(jobTracker).toBeDefined();
    const items = jobTracker!.items.map((i) => [i.name, i.href]);
    expect(items).toEqual([
      ["Jobs", "/jobs"],
      ["Calendar", "/calendar"],
      ["Email Templates", "/emails"],
    ]);
  });

  it("should have Salary Tools in Negotiation group", () => {
    const negotiation = navigationGroups.find((g) => g.label === "Negotiation");
    expect(negotiation).toBeDefined();
    const salaryTools = negotiation!.items.find((i) => i.name === "Salary Tools");
    expect(salaryTools).toBeDefined();
    expect(salaryTools!.href).toBe("/salary");
    expect(salaryTools!.icon).toBeDefined();
  });

  it("should have Analytics in Insights group", () => {
    const insights = navigationGroups.find((g) => g.label === "Insights");
    expect(insights).toBeDefined();
    const analytics = insights!.items.find((i) => i.name === "Analytics");
    expect(analytics).toBeDefined();
    expect(analytics!.href).toBe("/analytics");
    expect(analytics!.icon).toBeDefined();
  });

  it("should have correct hrefs for core nav items", () => {
    const allItems = navigationGroups.flatMap((g) => g.items);
    const dashboard = allItems.find((i) => i.name === "Dashboard");
    const documents = allItems.find((i) => i.name === "Documents");
    const studio = allItems.find((i) => i.name === "Document Studio");
    const jobs = allItems.find((i) => i.name === "Jobs");
    const calendar = allItems.find((i) => i.name === "Calendar");
    const emailTemplates = allItems.find((i) => i.name === "Email Templates");
    const interviewPrep = allItems.find((i) => i.name === "Interview Prep");
    const salaryTools = allItems.find((i) => i.name === "Salary Tools");
    const analytics = allItems.find((i) => i.name === "Analytics");

    expect(dashboard?.href).toBe("/dashboard");
    expect(documents?.href).toBe("/bank");
    expect(studio?.href).toBe("/studio");
    expect(jobs?.href).toBe("/jobs");
    expect(calendar?.href).toBe("/calendar");
    expect(emailTemplates?.href).toBe("/emails");
    expect(interviewPrep?.href).toBe("/interview");
    expect(salaryTools?.href).toBe("/salary");
    expect(analytics?.href).toBe("/analytics");
  });

  it("should have icons for all nav items", () => {
    const allItems = navigationGroups.flatMap((g) => g.items);
    for (const item of allItems) {
      expect(item.icon).toBeDefined();
      expect(typeof item.icon).toMatch(/function|object/);
    }
  });
});

describe("bottomNavigation", () => {
  it("should contain only Settings", () => {
    expect(bottomNavigation).toHaveLength(1);
    expect(bottomNavigation[0].name).toBe("Settings");
    expect(bottomNavigation[0].href).toBe("/settings");
  });

  it("should not contain Notifications, Dark, Collapse, or Sign in", () => {
    const names = bottomNavigation.map((i) => i.name);
    expect(names).not.toContain("Notifications");
    expect(names).not.toContain("Dark");
    expect(names).not.toContain("Collapse");
    expect(names).not.toContain("Sign in");
    expect(names).not.toContain("Sign In");
  });
});
