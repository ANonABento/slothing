import {
  Extension,
  Node,
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  mergeAttributes,
  type NodeViewProps,
} from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextSelection } from "@tiptap/pm/state";
import StarterKit from "@tiptap/starter-kit";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { createElement, type KeyboardEvent } from "react";

function getDataAttribute(element: HTMLElement, name: string): string {
  return element.getAttribute(name) || "";
}

function omitAttribute(
  attributes: Record<string, unknown>,
  key: string
): Record<string, unknown> {
  const { [key]: _omitted, ...rest } = attributes;
  return rest;
}

function omitAttributes(
  attributes: Record<string, unknown>,
  keys: string[]
): Record<string, unknown> {
  return keys.reduce(omitAttribute, attributes);
}

const CONTACT_INFO_ATTRIBUTES = [
  "name",
  "email",
  "phone",
  "location",
  "linkedin",
  "github",
];

const CONTACT_DETAIL_ATTRIBUTES = CONTACT_INFO_ATTRIBUTES.filter(
  (key) => key !== "name"
);

function handleEditableAttributeKeyDown(event: KeyboardEvent<HTMLElement>) {
  if (event.key !== "Enter") return;

  event.preventDefault();
  event.currentTarget.blur();
}

function editableAttributeProps(
  updateAttributes: NodeViewProps["updateAttributes"],
  attribute: string,
  className?: string
) {
  return {
    className,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onBlur: (event: { currentTarget: HTMLElement }) => {
      updateAttributes({
        [attribute]: event.currentTarget.textContent ?? "",
      });
    },
    onKeyDown: handleEditableAttributeKeyDown,
  };
}

function ResumeSectionView({ node, updateAttributes }: NodeViewProps) {
  const title = String(node.attrs.title || "");

  return createElement(
    NodeViewWrapper,
    {
      as: "section",
      "data-type": "resume-section",
      "data-section-title": title,
      className: "resume-section",
    },
    createElement("button", {
      type: "button",
      className: "resume-section-drag-handle",
      contentEditable: false,
      draggable: true,
      "data-drag-handle": "",
      "aria-label": title ? `Drag ${title} section` : "Drag resume section",
    }),
    createElement(
      "h2",
      editableAttributeProps(
        updateAttributes,
        "title",
        "resume-section-title"
      ),
      title
    ),
    createElement(NodeViewContent, {
      as: "div",
      className: "resume-section-content",
    })
  );
}

function ResumeEntryView({ node, updateAttributes }: NodeViewProps) {
  const company = String(node.attrs.company || "");
  const title = String(node.attrs.title || "");
  const dates = String(node.attrs.dates || "");

  return createElement(
    NodeViewWrapper,
    {
      as: "div",
      "data-type": "resume-entry",
      "data-company": company,
      "data-title": title,
      "data-dates": dates,
      className: "experience-item resume-entry",
    },
    createElement(
      "div",
      { className: "experience-header" },
      createElement(
        "div",
        {},
        createElement(
          "h3",
          editableAttributeProps(updateAttributes, "title"),
          title
        ),
        createElement(
          "span",
          editableAttributeProps(updateAttributes, "company", "company"),
          company
        )
      ),
      createElement(
        "span",
        editableAttributeProps(updateAttributes, "dates", "dates"),
        dates
      )
    ),
    createElement(NodeViewContent, {
      as: "div",
      className: "resume-entry-bullets",
    })
  );
}

function ContactInfoView({ node, updateAttributes }: NodeViewProps) {
  const name = String(node.attrs.name || "");
  const details = CONTACT_DETAIL_ATTRIBUTES.map((attribute) => ({
    attribute,
    value: String(node.attrs[attribute] || ""),
  })).filter((detail) => detail.value);
  const detailNodes = details.flatMap(({ attribute, value }, index) => {
    const field = createElement(
      "span",
      {
        key: attribute,
        ...editableAttributeProps(updateAttributes, attribute),
      },
      value
    );

    return index === 0
      ? [field]
      : [
          createElement("span", { key: `${attribute}-separator` }, "|"),
          field,
        ];
  });

  return createElement(
    NodeViewWrapper,
    {
      as: "div",
      "data-type": "contact-info",
      "data-contact-name": name,
      "data-contact-email": String(node.attrs.email || ""),
      "data-contact-phone": String(node.attrs.phone || ""),
      "data-contact-location": String(node.attrs.location || ""),
      "data-contact-linkedin": String(node.attrs.linkedin || ""),
      "data-contact-github": String(node.attrs.github || ""),
      className: "header",
    },
    createElement(
      "h1",
      editableAttributeProps(updateAttributes, "name"),
      name
    ),
    createElement("div", { className: "contact" }, ...detailNodes)
  );
}

export const ResumeSection = Node.create({
  name: "resumeSection",
  group: "block",
  content: "block+",
  defining: true,
  draggable: true,

  addAttributes() {
    return {
      title: {
        default: "",
        parseHTML: (element: HTMLElement) =>
          getDataAttribute(element, "data-section-title"),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'section[data-type="resume-section"]',
        contentElement: ".resume-section-content",
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const title = String(node.attrs.title || "");
    const attributes = omitAttribute(HTMLAttributes, "title");

    return [
      "section",
      mergeAttributes(attributes, {
        "data-type": "resume-section",
        "data-section-title": title,
        class: "resume-section",
      }),
      [
        "button",
        {
          type: "button",
          class: "resume-section-drag-handle",
          contenteditable: "false",
          draggable: "true",
          "aria-label": title ? `Drag ${title} section` : "Drag resume section",
        },
      ],
      ["h2", { class: "resume-section-title" }, title],
      ["div", { class: "resume-section-content" }, 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResumeSectionView);
  },
});

function getFirstTextSelectionPosition(
  section: { node: ProseMirrorNode; from: number }
): number | null {
  let textPosition: number | null = null;

  section.node.descendants((node, pos) => {
    if (textPosition !== null) return false;
    if (!node.isTextblock) return true;

    textPosition = section.from + pos + 2;
    return false;
  });

  return textPosition;
}

export function findAdjacentResumeSectionTextPosition(
  doc: ProseMirrorNode,
  selectionFrom: number,
  direction: 1 | -1
): number | null {
  const sections: Array<{ node: ProseMirrorNode; from: number; to: number }> =
    [];

  doc.descendants((node, pos) => {
    if (node.type.name === "resumeSection") {
      sections.push({ node, from: pos, to: pos + node.nodeSize });
    }
  });

  if (sections.length === 0) return null;

  const currentIndex = sections.findIndex(
    (section) => selectionFrom >= section.from && selectionFrom < section.to
  );
  if (currentIndex === -1) return null;

  const target = sections[currentIndex + direction];
  return target ? getFirstTextSelectionPosition(target) : null;
}

export const ResumeSectionKeyboardNavigation = Extension.create({
  name: "resumeSectionKeyboardNavigation",

  addKeyboardShortcuts() {
    const moveToAdjacentSection =
      (direction: 1 | -1) =>
      () => {
        const { state, view } = this.editor;
        const targetPosition = findAdjacentResumeSectionTextPosition(
          state.doc,
          state.selection.from,
          direction
        );

        if (targetPosition === null) return false;

        const selection = TextSelection.near(
          state.doc.resolve(targetPosition),
          1
        );
        view.dispatch(state.tr.setSelection(selection).scrollIntoView());
        return true;
      };

    return {
      Tab: moveToAdjacentSection(1),
      "Shift-Tab": moveToAdjacentSection(-1),
    };
  },
});

export const ResumeEntry = Node.create({
  name: "resumeEntry",
  group: "block",
  content: "bulletList?",
  defining: true,

  addAttributes() {
    return {
      company: {
        default: "",
        parseHTML: (element: HTMLElement) =>
          getDataAttribute(element, "data-company"),
      },
      title: {
        default: "",
        parseHTML: (element: HTMLElement) =>
          getDataAttribute(element, "data-title"),
      },
      dates: {
        default: "",
        parseHTML: (element: HTMLElement) =>
          getDataAttribute(element, "data-dates"),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="resume-entry"]',
        contentElement: ".resume-entry-bullets",
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const company = String(node.attrs.company || "");
    const title = String(node.attrs.title || "");
    const dates = String(node.attrs.dates || "");
    const attributes = omitAttribute(
      omitAttribute(omitAttribute(HTMLAttributes, "company"), "title"),
      "dates"
    );

    return [
      "div",
      mergeAttributes(attributes, {
        "data-type": "resume-entry",
        "data-company": company,
        "data-title": title,
        "data-dates": dates,
        class: "experience-item resume-entry",
      }),
      [
        "div",
        { class: "experience-header" },
        [
          "div",
          {},
          ["h3", {}, title],
          ["span", { class: "company" }, company],
        ],
        ["span", { class: "dates" }, dates],
      ],
      ["div", { class: "resume-entry-bullets" }, 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResumeEntryView);
  },
});

export const ContactInfoNode = Node.create({
  name: "contactInfo",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      name: {
        default: "",
        parseHTML: (element: HTMLElement) =>
          getDataAttribute(element, "data-contact-name"),
      },
      email: {
        default: "",
        parseHTML: (element: HTMLElement) =>
          getDataAttribute(element, "data-contact-email"),
      },
      phone: {
        default: "",
        parseHTML: (element: HTMLElement) =>
          getDataAttribute(element, "data-contact-phone"),
      },
      location: {
        default: "",
        parseHTML: (element: HTMLElement) =>
          getDataAttribute(element, "data-contact-location"),
      },
      linkedin: {
        default: "",
        parseHTML: (element: HTMLElement) =>
          getDataAttribute(element, "data-contact-linkedin"),
      },
      github: {
        default: "",
        parseHTML: (element: HTMLElement) =>
          getDataAttribute(element, "data-contact-github"),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="contact-info"]' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const name = String(node.attrs.name || "");
    const details = CONTACT_INFO_ATTRIBUTES.filter((key) => key !== "name")
      .map((key) => String(node.attrs[key] || ""))
      .filter(Boolean);
    const attributes = omitAttributes(HTMLAttributes, CONTACT_INFO_ATTRIBUTES);

    return [
      "div",
      mergeAttributes(attributes, {
        "data-type": "contact-info",
        "data-contact-name": name,
        "data-contact-email": String(node.attrs.email || ""),
        "data-contact-phone": String(node.attrs.phone || ""),
        "data-contact-location": String(node.attrs.location || ""),
        "data-contact-linkedin": String(node.attrs.linkedin || ""),
        "data-contact-github": String(node.attrs.github || ""),
        class: "header",
      }),
      ["h1", {}, name],
      [
        "div",
        { class: "contact" },
        ...details.flatMap((detail, index) =>
          index === 0 ? [detail] : [["span", {}, "|"], detail]
        ),
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ContactInfoView);
  },
});

export const CoverLetterBlock = Node.create({
  name: "coverLetterBlock",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      label: {
        default: "Cover Letter",
        parseHTML: (element: HTMLElement) =>
          getDataAttribute(element, "data-label") || "Cover Letter",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'section[data-type="cover-letter-block"]',
        contentElement: ".cover-letter-block-content",
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const label = String(node.attrs.label || "Cover Letter");
    const attributes = omitAttribute(HTMLAttributes, "label");

    return [
      "section",
      mergeAttributes(attributes, {
        "data-type": "cover-letter-block",
        "data-label": label,
        class: "cover-letter-block",
      }),
      ["div", { class: "cover-letter-block-label" }, label],
      ["div", { class: "cover-letter-block-content" }, 0],
    ];
  },
});

export const resumeEditorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
    underline: false,
  }),
  Underline,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Placeholder.configure({
    placeholder: "Click to add your experience...",
    includeChildren: true,
    showOnlyCurrent: false,
  }),
  ContactInfoNode,
  ResumeSection,
  ResumeEntry,
  CoverLetterBlock,
  ResumeSectionKeyboardNavigation,
];
