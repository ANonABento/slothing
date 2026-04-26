import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getBankEntries } from "@/lib/db/profile-bank";
import { bankEntriesToResume } from "@/lib/resume/bank-to-resume";
import { generateResumeHTML } from "@/lib/resume/pdf";
import type { ContactInfo } from "@/types";

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const rawBody = await request.text();
    if (!rawBody.trim()) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON" },
        { status: 400 }
      );
    }

    if (body === null || typeof body !== "object") {
      return NextResponse.json(
        { error: "Request body must be a JSON object" },
        { status: 400 }
      );
    }

    const { entryIds, templateId = "classic", contact } = body as {
      entryIds: string[];
      templateId?: string;
      contact?: ContactInfo;
    };

    if (!Array.isArray(entryIds) || entryIds.length === 0) {
      return NextResponse.json(
        { error: "entryIds must be a non-empty array" },
        { status: 400 }
      );
    }

    const allEntries = getBankEntries(authResult.userId);
    const selectedEntries = allEntries.filter((e) => entryIds.includes(e.id));

    const resume = bankEntriesToResume(
      selectedEntries,
      contact || { name: "Your Name" }
    );

    const html = generateResumeHTML(resume, templateId, authResult.userId);

    return NextResponse.json({ html, resume });
  } catch (error) {
    console.error("Builder error:", error);
    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}
