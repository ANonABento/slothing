import { BubbleMenu } from "@tiptap/extension-bubble-menu";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import {
  Color,
  FontFamily,
  FontSize,
  LineHeight,
  TextStyle,
} from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { mergeAttributes, type Extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  ContactInfoNode,
  CoverLetterBlock,
  ResumeEntry,
  ResumeSection,
  ResumeSectionKeyboardNavigation,
} from "./extensions";
import { PageBreak } from "./page-break";

export interface EditorExtensionsOptions {
  placeholder?: string;
}

const ResumeTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      noBorders: {
        default: false,
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("data-no-borders") === "true",
        renderHTML: (attributes: Record<string, unknown>) =>
          attributes.noBorders
            ? {
                "data-no-borders": "true",
                class: "tiptap-table tiptap-table--no-borders",
              }
            : { class: "tiptap-table" },
      },
    };
  },
});

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("width") || element.style.width || null,
        renderHTML: (attributes: Record<string, unknown>) =>
          attributes.width ? { width: String(attributes.width) } : {},
      },
      height: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("height") || element.style.height || null,
        renderHTML: (attributes: Record<string, unknown>) =>
          attributes.height ? { height: String(attributes.height) } : {},
      },
      wrap: {
        default: "inline",
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("data-wrap") || "inline",
        renderHTML: (attributes: Record<string, unknown>) => ({
          "data-wrap": String(attributes.wrap || "inline"),
        }),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: "tiptap-image",
      }),
    ];
  },
});

export function getEditorExtensions(
  options: EditorExtensionsOptions = {},
): Extensions {
  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      underline: false,
      link: false,
    }),
    Underline,
    Subscript,
    Superscript,
    TextStyle,
    Color,
    FontFamily,
    FontSize,
    LineHeight.configure({
      types: ["heading", "paragraph"],
    }),
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
      alignments: ["left", "center", "right", "justify"],
    }),
    Link.configure({
      autolink: true,
      openOnClick: false,
      HTMLAttributes: {
        rel: "noopener noreferrer",
        target: "_blank",
      },
    }),
    ResizableImage.configure({
      allowBase64: true,
      resize: {
        enabled: true,
        directions: [
          "top",
          "right",
          "bottom",
          "left",
          "top-right",
          "top-left",
          "bottom-right",
          "bottom-left",
        ],
        minWidth: 48,
        minHeight: 24,
      },
    }),
    ResumeTable.configure({
      resizable: true,
      lastColumnResizable: true,
      allowTableNodeSelection: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    PageBreak,
    BubbleMenu,
    Placeholder.configure({
      placeholder: options.placeholder ?? "Click to add your experience...",
      includeChildren: true,
      showOnlyCurrent: false,
    }),
    ContactInfoNode,
    ResumeSection,
    ResumeEntry,
    CoverLetterBlock,
    ResumeSectionKeyboardNavigation,
  ];
}

export const resumeEditorExtensions = getEditorExtensions();
