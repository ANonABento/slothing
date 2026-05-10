import mammoth from "mammoth";
import { describe, expect, it } from "vitest";
import { convertContentToDocx } from "./docx-export";

async function rawTextFromDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

describe("convertContentToDocx", () => {
  it("exports paragraphs, headings, marks, lists, links, and tables", async () => {
    const buffer = await convertContentToDocx({
      mode: "resume",
      content: {
        type: "doc",
        content: [
          {
            type: "contactInfo",
            attrs: {
              name: "Jane Doe",
              email: "jane@example.com",
              linkedin: "linkedin.com/in/jane",
            },
          },
          {
            type: "resumeSection",
            attrs: { title: "Experience" },
            content: [
              {
                type: "resumeEntry",
                attrs: {
                  title: "Staff Engineer",
                  company: "Acme",
                  dates: "2023 - Present",
                },
                content: [
                  {
                    type: "bulletList",
                    content: [
                      {
                        type: "listItem",
                        content: [
                          {
                            type: "paragraph",
                            content: [
                              {
                                type: "text",
                                text: "Built reliable systems",
                                marks: [{ type: "bold" }],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Portfolio: " },
                  {
                    type: "text",
                    text: "site",
                    marks: [
                      { type: "italic" },
                      { type: "link", attrs: { href: "https://example.com" } },
                    ],
                  },
                ],
              },
              {
                type: "table",
                content: [
                  {
                    type: "tableRow",
                    content: [
                      {
                        type: "tableCell",
                        content: [
                          {
                            type: "paragraph",
                            content: [{ type: "text", text: "Skill" }],
                          },
                        ],
                      },
                      {
                        type: "tableCell",
                        content: [
                          {
                            type: "paragraph",
                            content: [{ type: "text", text: "TypeScript" }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    expect(buffer.byteLength).toBeGreaterThan(0);
    await expect(rawTextFromDocx(buffer)).resolves.toContain("Jane Doe");
    await expect(rawTextFromDocx(buffer)).resolves.toContain("Experience");
    await expect(rawTextFromDocx(buffer)).resolves.toContain(
      "Staff Engineer - Acme (2023 - Present)",
    );
    await expect(rawTextFromDocx(buffer)).resolves.toContain("TypeScript");
  });

  it("exports cover letter blocks and ignores image nodes", async () => {
    const text = await rawTextFromDocx(
      await convertContentToDocx({
        mode: "cover_letter",
        pageSettings: {
          size: "a4",
          marginPreset: "narrow",
          margins: { top: 0.5, right: 0.5, bottom: 0.5, left: 0.5 },
        },
        content: {
          type: "doc",
          content: [
            {
              type: "coverLetterBlock",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Dear hiring team," }],
                },
                { type: "image", attrs: { src: "https://example.com/x.png" } },
                { type: "pageBreak" },
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Sincerely, Jane" }],
                },
              ],
            },
          ],
        },
      }),
    );

    expect(text).toContain("Dear hiring team,");
    expect(text).toContain("Sincerely, Jane");
  });
});
