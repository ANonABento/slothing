import { describe, expect, it } from "vitest";
import { COVER_LETTER_TEMPLATES, TEMPLATES } from "@/lib/resume/templates";
import {
  createEditorBodyHtml,
  createPrintableCoverLetterEditorHtml,
  createPrintableEditorHtml,
} from "./document-html";
import type { TipTapJSONContent } from "./types";

describe("createEditorBodyHtml", () => {
  it("serializes TipTap resume content to editable resume HTML", () => {
    const content: TipTapJSONContent = {
      type: "doc",
      content: [
        {
          type: "resumeSection",
          attrs: { title: "Summary" },
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Product engineer" }],
            },
          ],
        },
      ],
    };

    const html = createEditorBodyHtml(content);

    expect(html).toContain('data-type="resume-section"');
    expect(html).toContain('data-section-title="Summary"');
    expect(html).toContain("Product engineer");
  });

  it("serializes tables for layout-driven resume content", () => {
    const content: TipTapJSONContent = {
      type: "doc",
      content: [
        {
          type: "table",
          attrs: { noBorders: true },
          content: [
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Left" }],
                    },
                  ],
                },
                {
                  type: "tableCell",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Right" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const html = createEditorBodyHtml(content);

    expect(html).toContain("<table");
    expect(html).toContain('data-no-borders="true"');
    expect(html).toContain("<td");
    expect(html).toContain("Right");
  });
});

describe("createPrintableEditorHtml", () => {
  it("wraps editor body HTML in printable template CSS", () => {
    const template = TEMPLATES.find((item) => item.id === "classic")!;
    const html = createPrintableEditorHtml(
      "<p>Resume body</p>",
      template.styles,
      "Jane <Resume>"
    );

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<title>Jane &lt;Resume&gt;</title>");
    expect(html).toContain(template.styles.accentColor);
    expect(html).toContain("@media print");
    expect(html).toContain("@page { size: letter; margin: 1in 1in 1in 1in; }");
    expect(html).toContain(".resume-section-drag-handle");
    expect(html).toContain("<p>Resume body</p>");
  });
});

describe("createPrintableCoverLetterEditorHtml", () => {
  it("wraps freeform cover letter editor HTML in a printable letter document", () => {
    const template = COVER_LETTER_TEMPLATES.find(
      (item) => item.id === "formal"
    )!;
    const html = createPrintableCoverLetterEditorHtml(
      "<p>Dear Hiring Team,</p>",
      template.styles,
      "Jane <Cover Letter>"
    );

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<title>Jane &lt;Cover Letter&gt;</title>");
    expect(html).toContain('class="cover-letter-document"');
    expect(html).toContain('class="letter-page"');
    expect(html).toContain(template.styles.pagePadding);
    expect(html).toContain(template.styles.bodyMaxWidth);
    expect(html).toContain("@page");
    expect(html).toContain("<p>Dear Hiring Team,</p>");
  });
});
