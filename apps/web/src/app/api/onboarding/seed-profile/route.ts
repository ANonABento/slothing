/**
 * @route POST /api/onboarding/seed-profile
 * @description Seed a profile for users starting onboarding without a resume
 * @auth Required
 * @request Partial<Profile> with required contact name, email, and headline
 * @response { success: true; profile: Profile | null }
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getProfile, updateProfile } from "@/lib/db";
import {
  contactInfoSchema,
  educationSchema,
  experienceSchema,
  projectSchema,
  skillSchema,
} from "@/lib/constants";
import { requireAuth, isAuthError } from "@/lib/auth";
import { mergeParsedProfileForAutoPromote } from "@/lib/profile/auto-promote";
import { populateBankFromProfile } from "@/lib/resume/info-bank";

export const dynamic = "force-dynamic";

const seedContactSchema = contactInfoSchema.extend({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Email is required"),
  headline: z.string().trim().min(1, "Target role is required").max(200),
});

const seedProfileSchema = z.object({
  contact: seedContactSchema,
  summary: z.string().trim().max(5000).optional(),
  experiences: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  skills: z.array(skillSchema).optional(),
  projects: z.array(projectSchema).optional(),
});

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const rawData = await request.json();
    const parseResult = seedProfileSchema.safeParse(rawData);

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 },
      );
    }

    const seed = parseResult.data;
    const existingProfile = getProfile(authResult.userId);
    const promoted = mergeParsedProfileForAutoPromote(existingProfile, seed);

    if (Object.keys(promoted).length > 0) {
      updateProfile(promoted, authResult.userId);
    }

    try {
      populateBankFromProfile(seed, undefined, authResult.userId);
    } catch (bankError) {
      console.error(
        "[seed-profile] Bank population failed:",
        bankError instanceof Error ? bankError.stack : bankError,
      );
    }

    const profile = getProfile(authResult.userId);
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error(
      "[seed-profile] Seed error:",
      error instanceof Error ? error.stack : error,
    );
    return NextResponse.json(
      { error: "Failed to seed profile" },
      { status: 500 },
    );
  }
}
