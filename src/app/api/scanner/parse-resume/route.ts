import { NextRequest, NextResponse } from "next/server";
import { validateFileMagicBytes } from "@/lib/constants";
import { parsePdfResume, parseResumeText } from "@/lib/parsers/pdf-resume";
import { getClientIdentifier, rateLimiters } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const MAX_SCANNER_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "text/plain"] as const;

function rateLimitResponse(request: NextRequest) {
  const rateLimit = rateLimiters.standard(getClientIdentifier(request));
  if (rateLimit.allowed) return null;
  return NextResponse.json(
    {
      error: "Too many scan requests. Please try again later.",
      code: "rate_limited",
    },
    {
      status: 429,
      headers: {
        "Retry-After": Math.max(
          1,
          Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        ).toString(),
      },
    },
  );
}

function publicParsePayload(result: Awaited<ReturnType<typeof parsePdfResume>>) {
  const { rawText: _rawText, ...safeResult } = result;
  return safeResult;
}

function isPasswordProtectedPdfError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /encrypt|password|permission denied/i.test(message);
}

export async function POST(request: NextRequest) {
  const limited = rateLimitResponse(request);
  if (limited) return limited;

  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = (await request.json().catch(() => null)) as { text?: unknown } | null;
      if (typeof body?.text !== "string" || body.text.trim().length === 0) {
        return NextResponse.json(
          { error: "Resume text is required.", code: "invalid_text" },
          { status: 400 },
        );
      }
      return NextResponse.json(publicParsePayload(parseResumeText(body.text)));
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (
      !file ||
      typeof file !== "object" ||
      typeof (file as File).arrayBuffer !== "function"
    ) {
      return NextResponse.json(
        { error: "A PDF or text file is required.", code: "missing_file" },
        { status: 400 },
      );
    }

    if (file.size > MAX_SCANNER_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB.", code: "file_too_large" },
        { status: 413 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
      return NextResponse.json(
        { error: "Invalid file type. Upload a PDF or TXT file.", code: "invalid_file_type" },
        { status: 415 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!validateFileMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { error: "File content does not match its type.", code: "invalid_file_content" },
        { status: 415 },
      );
    }

    try {
      const result =
        file.type === "application/pdf"
          ? await parsePdfResume(buffer)
          : parseResumeText(buffer.toString("utf8"));

      return NextResponse.json(publicParsePayload(result));
    } catch (error) {
      if (isPasswordProtectedPdfError(error)) {
        return NextResponse.json(
          {
            error: "This PDF is password-protected. Remove the password and try again.",
            code: "password_protected",
          },
          { status: 422 },
        );
      }
      throw error;
    }
  } catch (error) {
    console.error(
      "[scanner/parse-resume] failed",
      error instanceof Error ? error.name : "UnknownError",
    );
    return NextResponse.json(
      { error: "We could not parse that resume.", code: "parse_failed" },
      { status: 500 },
    );
  }
}
