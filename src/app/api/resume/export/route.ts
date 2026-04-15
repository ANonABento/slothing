import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getGeneratedResume } from "@/lib/db";
import { generateResumeLatex, LATEX_TEMPLATES, type LatexOptions } from "@/lib/resume/latex-generator";
import type { TailoredResume } from "@/lib/resume/generator";
import { exec } from "child_process";
import { writeFile, readFile, unlink, mkdtemp } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

const LATEX_CLEANUP_EXTENSIONS = ["resume.tex", "resume.pdf", "resume.aux", "resume.log", "resume.out"];

export async function GET() {
  return NextResponse.json({
    templates: LATEX_TEMPLATES.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      layout: t.layout,
    })),
  });
}
import { z } from "zod";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getGeneratedResume } from "@/lib/db/resumes";
import { generateResumeHTML } from "@/lib/resume/pdf";
import { generatePDF } from "@/lib/resume/pdf-export";

const exportByIdSchema = z.object({
  resumeId: z.string().min(1),
  templateId: z.string().min(1).default("classic"),
});

const exportByHtmlSchema = z.object({
  html: z.string().min(1),
});

const requestSchema = z.union([exportByIdSchema, exportByHtmlSchema]);

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();
    const { resumeId, templateId = "modern", options = {} as LatexOptions, compilePdf = false } = body;

    if (!resumeId) {
      return NextResponse.json(
        { error: "resumeId is required" },
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Provide either { resumeId, templateId } or { html }" },
        { status: 400 }
      );
    }

    const savedResume = getGeneratedResume(resumeId, authResult.userId);
    if (!savedResume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    const resume: TailoredResume = JSON.parse(savedResume.contentJson);
    const latex = generateResumeLatex(resume, templateId, options);

    if (compilePdf) {
      try {
        const tmpDir = await mkdtemp(join(tmpdir(), "resume-"));
        const texPath = join(tmpDir, "resume.tex");
        const pdfPath = join(tmpDir, "resume.pdf");

        await writeFile(texPath, latex);
        await execAsync(`pdflatex -interaction=nonstopmode -output-directory="${tmpDir}" "${texPath}"`, {
          timeout: 30000,
        });

        const pdfBuffer = await readFile(pdfPath);

        await Promise.allSettled(
          LATEX_CLEANUP_EXTENSIONS.map((f) => unlink(join(tmpDir, f)))
        );

        return new NextResponse(pdfBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="resume.pdf"`,
          },
        });
      } catch {
        // pdflatex not available or compilation failed, fall back to .tex
        return new NextResponse(latex, {
          headers: {
            "Content-Type": "application/x-tex",
            "Content-Disposition": `attachment; filename="resume.tex"`,
            "X-Fallback": "pdflatex-unavailable",
          },
        });
      }
    }

    return new NextResponse(latex, {
      headers: {
        "Content-Type": "application/x-tex",
        "Content-Disposition": `attachment; filename="resume.tex"`,
      },
    });
  } catch (error) {
    console.error("LaTeX export error:", error);
    return NextResponse.json(
      { error: "Failed to export resume" },
    let html: string;

    if ("html" in parsed.data) {
      html = parsed.data.html;
    } else {
      const resume = getGeneratedResume(parsed.data.resumeId, authResult.userId);
      if (!resume) {
        return NextResponse.json(
          { error: "Resume not found" },
          { status: 404 }
        );
      }
      const resumeContent = JSON.parse(resume.contentJson);
      html = generateResumeHTML(resumeContent, parsed.data.templateId);
    }

    const pdfBuffer = await generatePDF(html);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
