import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import type { Profile } from "@/types";

const routeMocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  getProfile: vi.fn(),
  updateProfile: vi.fn(),
  populateBankFromProfile: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: routeMocks.requireAuth,
  isAuthError: (value: unknown) => value instanceof Response,
}));

vi.mock("@/lib/db", () => ({
  getProfile: routeMocks.getProfile,
  updateProfile: routeMocks.updateProfile,
}));

vi.mock("@/lib/resume/info-bank", () => ({
  populateBankFromProfile: routeMocks.populateBankFromProfile,
}));

import { POST } from "./route";

function jsonRequest(body: unknown) {
  return new NextRequest("http://localhost/api/onboarding/seed-profile", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

function profile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: "user-1",
    contact: { name: "" },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    ...overrides,
  };
}

const seedBody = {
  contact: {
    name: "Ada Lovelace",
    email: "ada@example.com",
    headline: "Frontend intern",
    targetRoles: ["Frontend intern"],
  },
  summary: "Building a starter profile.",
  skills: [{ id: "skill-1", name: "TypeScript", category: "other" }],
};

const seedExperience = {
  id: "exp-1",
  company: "Campus Cafe",
  title: "Barista",
  startDate: "",
  current: false,
  description: "Trained 3 new baristas.",
  highlights: ["Trained 3 new baristas."],
  skills: [],
};

const seedProject = {
  id: "project-1",
  name: "Community pantry dashboard",
  description: "Tracked donations and volunteer shifts.",
  technologies: [],
  highlights: ["Presented findings to class."],
};

describe("/api/onboarding/seed-profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routeMocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    routeMocks.getProfile.mockReturnValue(profile());
  });

  it("requires auth", async () => {
    routeMocks.requireAuth.mockResolvedValue(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    );

    const response = await POST(jsonRequest(seedBody));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      error: "Unauthorized",
    });
  });

  it("returns field-level validation errors", async () => {
    const response = await POST(
      jsonRequest({
        contact: { name: "", email: "not-email", headline: "" },
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Validation failed",
      errors: expect.arrayContaining([
        expect.objectContaining({ field: "contact.name" }),
        expect.objectContaining({ field: "contact.email" }),
        expect.objectContaining({ field: "contact.headline" }),
      ]),
    });
  });

  it("updates the profile and populates the bank", async () => {
    const updatedProfile = profile({
      contact: seedBody.contact,
      summary: seedBody.summary,
      skills: seedBody.skills as Profile["skills"],
    });
    routeMocks.getProfile
      .mockReturnValueOnce(profile())
      .mockReturnValueOnce(updatedProfile);

    const response = await POST(jsonRequest(seedBody));

    expect(response.status).toBe(200);
    expect(routeMocks.updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        contact: seedBody.contact,
        summary: seedBody.summary,
        skills: seedBody.skills,
      }),
      "user-1",
    );
    expect(routeMocks.populateBankFromProfile).toHaveBeenCalledWith(
      expect.objectContaining(seedBody),
      undefined,
      "user-1",
    );
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      profile: updatedProfile,
    });
  });

  it("accepts experiences and projects", async () => {
    const body = {
      ...seedBody,
      experiences: [seedExperience],
      projects: [seedProject],
    };
    const updatedProfile = profile({
      contact: seedBody.contact,
      summary: seedBody.summary,
      skills: seedBody.skills as Profile["skills"],
      experiences: [seedExperience],
      projects: [seedProject],
    });
    routeMocks.getProfile
      .mockReturnValueOnce(profile())
      .mockReturnValueOnce(updatedProfile);

    const response = await POST(jsonRequest(body));

    expect(response.status).toBe(200);
    expect(routeMocks.updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        experiences: [seedExperience],
        projects: [seedProject],
      }),
      "user-1",
    );
    expect(routeMocks.populateBankFromProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        experiences: [seedExperience],
        projects: [seedProject],
      }),
      undefined,
      "user-1",
    );
  });

  it("rejects malformed experience entries", async () => {
    const response = await POST(
      jsonRequest({
        ...seedBody,
        experiences: [{ company: "" }],
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Validation failed",
      errors: expect.arrayContaining([
        expect.objectContaining({ field: "experiences.0.company" }),
      ]),
    });
  });

  it("preserves existing manually edited contact fields", async () => {
    routeMocks.getProfile
      .mockReturnValueOnce(
        profile({
          contact: {
            name: "Manual Name",
            email: "",
            headline: "",
          },
        }),
      )
      .mockReturnValueOnce(
        profile({
          contact: {
            name: "Manual Name",
            email: "ada@example.com",
            headline: "Frontend intern",
            targetRoles: ["Frontend intern"],
          },
        }),
      );

    const response = await POST(jsonRequest(seedBody));

    expect(response.status).toBe(200);
    expect(routeMocks.updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        contact: expect.objectContaining({
          name: "Manual Name",
          email: "ada@example.com",
          headline: "Frontend intern",
        }),
      }),
      "user-1",
    );
  });
});
