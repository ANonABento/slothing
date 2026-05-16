import { nowEpoch } from "@/lib/format/time";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import {
  gateAiFeature,
  isAiGateResponse,
  type AiGatePass,
} from "@/lib/billing/ai-gate";
import { saveCustomTemplate } from "@/lib/db/custom-templates";
import { getClientIdentifier, rateLimiters } from "@/lib/rate-limit";
import {
  extractTemplateFromFile,
  getTemplateSourceType,
} from "@/lib/templates/import";

export const dynamic = "force-dynamic";

const MAX_TEMPLATE_FILE_BYTES = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;
  let aiGate: AiGatePass | null = null;

  const rateLimit = rateLimiters.standard(
    getClientIdentifier(request, authResult.userId),
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many template import requests.", code: "rate_limited" },
      {
        status: 429,
        headers: {
          "Retry-After": Math.max(
            1,
            Math.ceil((rateLimit.resetAt - nowEpoch()) / 1000),
          ).toString(),
        },
      },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const nameValue = formData.get("name");
    const persist = formData.get("persist") !== "false";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "A PDF or DOCX file is required.", code: "missing_file" },
        { status: 400 },
      );
    }

    if (file.size > MAX_TEMPLATE_FILE_BYTES) {
      return NextResponse.json(
        {
          error: "Template files must be 10MB or smaller.",
          code: "file_too_large",
        },
        { status: 400 },
      );
    }

    const sourceType = getTemplateSourceType(file.name, file.type);
    if (!sourceType || !(await hasExpectedSignature(file, sourceType))) {
      return NextResponse.json(
        {
          error: "Upload a valid PDF or DOCX file.",
          code: "unsupported_file_type",
        },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const gate = await gateAiFeature(
      authResult.userId,
      "document_assistant",
      `template-import:${nowEpoch()}`,
    );
    if (isAiGateResponse(gate)) return gate;
    aiGate = gate;
    const extracted = await extractTemplateFromFile({
      buffer,
      filename: file.name,
      mimeType: file.type,
      llmUserId: authResult.userId,
    });
    const name =
      typeof nameValue === "string" && nameValue.trim()
        ? nameValue.trim().slice(0, 100)
        : file.name.replace(/\.[^.]+$/, "").slice(0, 100);

    if (!persist) {
      return NextResponse.json({
        template: extracted.template,
        warnings: extracted.warnings,
        sectionsFound: extracted.sectionsFound,
      });
    }

    const saved = saveCustomTemplate(
      name,
      extracted.template,
      undefined,
      authResult.userId,
      { filename: file.name, type: sourceType },
    );

    return NextResponse.json({
      template: {
        id: saved.id,
        name: saved.name,
        sourceType: saved.sourceType,
        sourceFilename: saved.sourceFilename,
        analyzedStyles: saved.analyzedStyles,
      },
      warnings: extracted.warnings,
      sectionsFound: extracted.sectionsFound,
    });
  } catch (error) {
    aiGate?.refund();
    console.error("Template import error:", error);
    return NextResponse.json(
      {
        error: "We couldn't extract a reusable template from that file.",
        code: "extraction_failed",
      },
      { status: 422 },
    );
  }
}

async function hasExpectedSignature(
  file: File,
  sourceType: "pdf" | "docx",
): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  if (sourceType === "pdf") {
    return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44;
  }
  return bytes[0] === 0x50 && bytes[1] === 0x4b;
}
