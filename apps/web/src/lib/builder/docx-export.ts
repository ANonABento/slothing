import {
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  LevelFormat,
  Packer,
  PageBreak,
  Paragraph,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  UnderlineType,
  WidthType,
  type FileChild,
  type IRunOptions,
  type ParagraphChild,
} from "docx";
import {
  DEFAULT_PAGE_SETTINGS,
  normalizePageSettings,
  PAGE_SIZES,
  type PageSettings,
} from "@/lib/editor/page-settings";
import type { TipTapJSONContent } from "@/lib/editor/types";
import type {
  CoverLetterTemplateStyles,
  TemplateStyles,
} from "@/lib/resume/template-data";

type DocumentMode = "resume" | "cover_letter";
type DocxBlock = Paragraph | Table;

interface ConvertContentToDocxArgs {
  content: TipTapJSONContent;
  mode: DocumentMode;
  templateStyles?: TemplateStyles | CoverLetterTemplateStyles;
  pageSettings?: Partial<PageSettings>;
  title?: string;
}

const BULLET_NUMBERING_REFERENCE = "slothing-bullets";
const ORDERED_NUMBERING_REFERENCE = "slothing-numbered";

function isTipTapNode(value: unknown): value is TipTapJSONContent {
  return Boolean(value && typeof value === "object" && "type" in value);
}

function getContent(node: TipTapJSONContent): TipTapJSONContent[] {
  return Array.isArray(node.content) ? node.content.filter(isTipTapNode) : [];
}

function textFromNode(node: TipTapJSONContent): string {
  if (typeof node.text === "string") return node.text;
  return getContent(node).map(textFromNode).join("");
}

function stringAttr(node: TipTapJSONContent, key: string): string {
  const value = node.attrs?.[key];
  return typeof value === "string" ? value.trim() : "";
}

function hexColor(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().replace(/^#/, "");
  return /^[0-9a-fA-F]{6}$/.test(trimmed) ? trimmed : undefined;
}

function highlightColor(value: unknown): IRunOptions["highlight"] | undefined {
  const normalized =
    typeof value === "string"
      ? value.trim().replace(/^#/, "").toLowerCase()
      : "";
  if (normalized === "ffff00" || normalized === "yellow") return "yellow";
  if (normalized === "00ff00" || normalized === "green") return "green";
  if (normalized === "00ffff" || normalized === "cyan") return "cyan";
  if (normalized === "ff00ff" || normalized === "magenta") return "magenta";
  if (normalized === "ff0000" || normalized === "red") return "red";
  if (normalized === "0000ff" || normalized === "blue") return "blue";
  return undefined;
}

function marksToRunOptions(
  marks: TipTapJSONContent["marks"],
): Omit<IRunOptions, "text" | "children"> {
  const options: Record<string, unknown> = {};
  if (!Array.isArray(marks)) return options;

  for (const mark of marks) {
    if (mark.type === "bold") options.bold = true;
    if (mark.type === "italic") options.italics = true;
    if (mark.type === "underline") {
      options.underline = { type: UnderlineType.SINGLE };
    }
    if (mark.type === "strike") options.strike = true;
    if (mark.type === "code") {
      options.font = "Courier New";
      options.shading = { fill: "F3F4F6" };
    }
    if (mark.type === "subscript") options.subScript = true;
    if (mark.type === "superscript") options.superScript = true;
    if (mark.type === "textStyle") {
      options.color = hexColor(mark.attrs?.color) ?? options.color;
    }
    if (mark.type === "highlight") {
      options.highlight =
        highlightColor(mark.attrs?.color) ?? options.highlight;
    }
  }

  return options as Omit<IRunOptions, "text" | "children">;
}

function linkHref(marks: TipTapJSONContent["marks"]): string | null {
  const link = Array.isArray(marks)
    ? marks.find((mark) => mark.type === "link")
    : undefined;
  const href = link?.attrs?.href;
  return typeof href === "string" && href.trim() ? href : null;
}

function inlineToRuns(node: TipTapJSONContent): ParagraphChild[] {
  if (node.type === "hardBreak") {
    return [new TextRun({ text: "", break: 1 })];
  }

  if (node.type === "text") {
    const options = marksToRunOptions(node.marks);
    const text = node.text ?? "";
    const href = linkHref(node.marks);
    const run = new TextRun({ text, ...options });
    if (!href) return [run];
    return [
      new ExternalHyperlink({
        link: href,
        children: [new TextRun({ text, style: "Hyperlink", ...options })],
      }),
    ];
  }

  return getContent(node).flatMap(inlineToRuns);
}

function paragraphAlignment(
  node: TipTapJSONContent,
): (typeof AlignmentType)[keyof typeof AlignmentType] | undefined {
  const align = node.attrs?.textAlign;
  if (align === "center") return AlignmentType.CENTER;
  if (align === "right") return AlignmentType.RIGHT;
  if (align === "justify") return AlignmentType.JUSTIFIED;
  return undefined;
}

function headingLevel(
  level: unknown,
): (typeof HeadingLevel)[keyof typeof HeadingLevel] {
  if (level === 1) return HeadingLevel.HEADING_1;
  if (level === 2) return HeadingLevel.HEADING_2;
  if (level === 3) return HeadingLevel.HEADING_3;
  return HeadingLevel.HEADING_3;
}

function paragraphFromInline(
  node: TipTapJSONContent,
  options: {
    heading?: (typeof HeadingLevel)[keyof typeof HeadingLevel];
    bold?: boolean;
    spacingAfter?: number;
    numbering?: { reference: string; level: number };
  } = {},
): Paragraph {
  const children = inlineToRuns(node);
  const fallback = children.length > 0 ? children : [new TextRun("")];
  return new Paragraph({
    children:
      options.bold && fallback.every((child) => child instanceof TextRun)
        ? fallback.map((child) => child)
        : fallback,
    heading: options.heading,
    alignment: paragraphAlignment(node),
    numbering: options.numbering,
    spacing: { after: options.spacingAfter ?? 120 },
  });
}

function listItemsToParagraphs(
  node: TipTapJSONContent,
  reference: string,
): DocxBlock[] {
  return getContent(node).flatMap((item) => {
    if (item.type !== "listItem") return nodeToBlocks(item);
    const itemChildren = getContent(item);
    const firstParagraph = itemChildren.find(
      (child) => child.type === "paragraph",
    );
    const rest = itemChildren.filter((child) => child !== firstParagraph);
    const paragraph = firstParagraph ?? {
      type: "paragraph",
      content: [{ type: "text", text: textFromNode(item) }],
    };
    return [
      paragraphFromInline(paragraph, {
        numbering: { reference, level: 0 },
        spacingAfter: 60,
      }),
      ...rest.flatMap(nodeToBlocks),
    ];
  });
}

function resumeSectionToBlocks(node: TipTapJSONContent): DocxBlock[] {
  const title = stringAttr(node, "title");
  return [
    ...(title
      ? [
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 180, after: 80 },
          }),
        ]
      : []),
    ...getContent(node).flatMap(nodeToBlocks),
  ];
}

function resumeEntryToBlocks(node: TipTapJSONContent): DocxBlock[] {
  const title = stringAttr(node, "title");
  const company = stringAttr(node, "company");
  const dates = stringAttr(node, "dates");
  const header = [title, company].filter(Boolean).join(" - ");
  const dateSuffix = dates ? ` (${dates})` : "";
  return [
    ...(header || dates
      ? [
          new Paragraph({
            children: [
              new TextRun({ text: `${header}${dateSuffix}`, bold: true }),
            ],
            spacing: { before: 80, after: 60 },
          }),
        ]
      : []),
    ...getContent(node).flatMap(nodeToBlocks),
  ];
}

function contactInfoToBlocks(node: TipTapJSONContent): DocxBlock[] {
  const name = stringAttr(node, "name");
  const details = ["email", "phone", "location", "linkedin", "github"]
    .map((key) => stringAttr(node, key))
    .filter(Boolean);

  return [
    ...(name
      ? [
          new Paragraph({
            text: name,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
          }),
        ]
      : []),
    ...(details.length
      ? [
          new Paragraph({
            text: details.join(" | "),
            alignment: AlignmentType.CENTER,
            spacing: { after: 180 },
          }),
        ]
      : []),
  ];
}

function coverLetterBlockToBlocks(node: TipTapJSONContent): DocxBlock[] {
  return getContent(node).flatMap(nodeToBlocks);
}

function tableCellToBlocks(node: TipTapJSONContent): DocxBlock[] {
  const blocks = getContent(node).flatMap(nodeToBlocks);
  return blocks.length ? blocks : [new Paragraph("")];
}

function tableToBlock(node: TipTapJSONContent): Table {
  const rows = getContent(node)
    .filter((row) => row.type === "tableRow")
    .map(
      (row) =>
        new TableRow({
          children: getContent(row)
            .filter(
              (cell) =>
                cell.type === "tableCell" || cell.type === "tableHeader",
            )
            .map(
              (cell) =>
                new TableCell({
                  children: tableCellToBlocks(cell),
                  columnSpan:
                    typeof cell.attrs?.colspan === "number"
                      ? cell.attrs.colspan
                      : undefined,
                }),
            ),
        }),
    );

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.AUTOFIT,
    borders:
      node.attrs?.noBorders === true
        ? {
            top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            insideHorizontal: {
              style: BorderStyle.NONE,
              size: 0,
              color: "FFFFFF",
            },
            insideVertical: {
              style: BorderStyle.NONE,
              size: 0,
              color: "FFFFFF",
            },
          }
        : undefined,
  });
}

function nodeToBlocks(node: TipTapJSONContent): DocxBlock[] {
  switch (node.type) {
    case "doc":
      return getContent(node).flatMap(nodeToBlocks);
    case "paragraph":
      return [paragraphFromInline(node)];
    case "heading":
      return [
        paragraphFromInline(node, {
          heading: headingLevel(node.attrs?.level),
          spacingAfter: 100,
        }),
      ];
    case "bulletList":
      return listItemsToParagraphs(node, BULLET_NUMBERING_REFERENCE);
    case "orderedList":
      return listItemsToParagraphs(node, ORDERED_NUMBERING_REFERENCE);
    case "blockquote":
      return [
        new Paragraph({
          children: [new TextRun({ text: textFromNode(node), italics: true })],
          indent: { left: convertInchesToTwip(0.25) },
        }),
      ];
    case "horizontalRule":
      return [
        new Paragraph({
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
          },
        }),
      ];
    case "pageBreak":
      return [new Paragraph({ children: [new PageBreak()] })];
    case "table":
      return [tableToBlock(node)];
    case "resumeSection":
      return resumeSectionToBlocks(node);
    case "resumeEntry":
      return resumeEntryToBlocks(node);
    case "contactInfo":
      return contactInfoToBlocks(node);
    case "coverLetterBlock":
      return coverLetterBlockToBlocks(node);
    case "image":
      return [];
    default:
      return getContent(node).flatMap(nodeToBlocks);
  }
}

function pageSettingsToDocxPage(pageSettings?: Partial<PageSettings>) {
  const normalized = normalizePageSettings(
    pageSettings ?? DEFAULT_PAGE_SETTINGS,
  );
  const size = PAGE_SIZES[normalized.size];
  return {
    size: {
      width: convertInchesToTwip(size.widthIn),
      height: convertInchesToTwip(size.heightIn),
    },
    margin: {
      top: convertInchesToTwip(normalized.margins.top),
      right: convertInchesToTwip(normalized.margins.right),
      bottom: convertInchesToTwip(normalized.margins.bottom),
      left: convertInchesToTwip(normalized.margins.left),
    },
  };
}

export function createDocxDocument(args: ConvertContentToDocxArgs): Document {
  const fontFamily =
    args.templateStyles?.fontFamily
      ?.split(",")[0]
      ?.replace(/['"]/g, "")
      .trim() || "Arial";
  const children = nodeToBlocks(args.content).filter(
    (block): block is FileChild =>
      block instanceof Paragraph || block instanceof Table,
  );

  return new Document({
    title:
      args.title ?? (args.mode === "cover_letter" ? "Cover Letter" : "Resume"),
    styles: {
      default: {
        document: {
          run: { font: fontFamily, size: 22 },
          paragraph: { spacing: { after: 120 } },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: BULLET_NUMBERING_REFERENCE,
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "\u2022",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.25),
                    hanging: convertInchesToTwip(0.15),
                  },
                },
              },
            },
          ],
        },
        {
          reference: ORDERED_NUMBERING_REFERENCE,
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.25),
                    hanging: convertInchesToTwip(0.15),
                  },
                },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: { page: pageSettingsToDocxPage(args.pageSettings) },
        children: children.length ? children : [new Paragraph("")],
      },
    ],
  });
}

export async function convertContentToDocx(
  args: ConvertContentToDocxArgs,
): Promise<Buffer> {
  return Packer.toBuffer(createDocxDocument(args));
}
