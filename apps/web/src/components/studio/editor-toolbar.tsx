"use client";

import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  Brush,
  Columns3,
  Download,
  Eraser,
  Highlighter,
  Image as ImageIcon,
  Indent,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  MoreHorizontal,
  Outdent,
  Printer,
  Redo2,
  Rows3,
  Strikethrough,
  Subscript,
  Superscript,
  Table2,
  Trash2,
  Underline,
  Undo2,
} from "lucide-react";
import { useRef, useState, type ComponentType, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  COLOR_SWATCHES,
  FONT_FAMILIES,
  FONT_SIZES,
  LINE_HEIGHTS,
} from "@/lib/editor/font-options";
import {
  clampZoomPercent,
  MAX_ZOOM_PERCENT,
  MIN_ZOOM_PERCENT,
} from "@/lib/editor/toolbar";
import type { ResumeTemplate } from "@/lib/resume/template-types";
import { cn } from "@/lib/utils";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

interface EditorToolbarProps {
  editor: Editor | null;
  templates: ResumeTemplate[];
  templateId: string;
  zoomPercent: number;
  canExport: boolean;
  isExporting?: boolean;
  onTemplateChange: (templateId: string) => void;
  onZoomChange: (zoomPercent: number) => void;
  onDownloadPdf: () => void;
  onPrint: () => void;
}

type Chain = any;

function chain(editor: Editor | null): Chain | null {
  return editor ? (editor.chain().focus() as Chain) : null;
}

function run(editor: Editor | null, command: (current: Chain) => Chain) {
  const current = chain(editor);
  if (!current) return;
  command(current).run();
}

export function toolbarButtonClass(isActive = false): string {
  return cn(
    "h-8 w-8 border-border text-foreground hover:bg-muted",
    isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
  );
}

function ToolbarButton({
  active,
  disabled,
  label,
  shortcut,
  children,
  onClick,
}: {
  active?: boolean;
  disabled?: boolean;
  label: string;
  shortcut?: string;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={toolbarButtonClass(active)}
      aria-label={label}
      title={shortcut ? `${label} (${shortcut})` : label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function ToolbarGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-1 rounded-md border bg-card p-1">
      <span className="px-1 text-xs font-semibold text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}

function ToolbarSeparator() {
  return (
    <span
      role="separator"
      aria-orientation="vertical"
      className="hidden h-7 w-px bg-border md:block"
    />
  );
}

function SelectControl({
  label,
  value,
  disabled,
  children,
  onChange,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  children: ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex h-8 items-center gap-1 rounded-md border bg-background px-2 text-xs">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        disabled={disabled}
        aria-label={label}
        className="max-w-32 bg-transparent outline-none disabled:opacity-50"
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        {children}
      </select>
    </label>
  );
}

function TableGridPicker({
  editor,
  disabled,
}: {
  editor: Editor | null;
  disabled: boolean;
}) {
  const a11yT = useA11yTranslations();

  const [hovered, setHovered] = useState({ rows: 1, cols: 1 });
  const cells = Array.from({ length: 64 }, (_, index) => {
    const row = Math.floor(index / 8) + 1;
    const col = (index % 8) + 1;
    const selected = row <= hovered.rows && col <= hovered.cols;
    return (
      <button
        key={`${row}-${col}`}
        type="button"
        aria-label={`Insert ${row} by ${col} table`}
        className={cn(
          "h-5 w-5 rounded-sm border border-border",
          selected && "bg-primary",
        )}
        onMouseEnter={() => setHovered({ rows: row, cols: col })}
        onFocus={() => setHovered({ rows: row, cols: col })}
        onClick={() =>
          run(editor, (current) =>
            current.insertTable({
              rows: row,
              cols: col,
              withHeaderRow: false,
            }),
          )
        }
      />
    );
  });

  return (
    <details className="relative">
      <summary
        className={cn(
          toolbarButtonClass(),
          "flex cursor-pointer list-none items-center justify-center rounded-md",
          disabled && "pointer-events-none opacity-50",
        )}
        aria-label={a11yT("insertTable")}
        title={a11yT("insertTable")}
      >
        <Table2 className="h-4 w-4" />
      </summary>
      <div className="absolute right-0 top-10 z-30 w-56 rounded-md border bg-popover p-3 text-popover-foreground shadow-[var(--shadow-elevated)]">
        <div className="mb-2 text-xs font-medium">
          {hovered.rows} x {hovered.cols}
        </div>
        <div className="grid grid-cols-8 gap-1">{cells}</div>
      </div>
    </details>
  );
}

function insertImageFromFile(editor: Editor | null, file: File | undefined) {
  if (!editor || !file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const src = String(reader.result || "");
    if (src) run(editor, (current) => current.setImage({ src }));
  };
  reader.readAsDataURL(file);
}

function InsertImageButton({
  editor,
  disabled,
}: {
  editor: Editor | null;
  disabled: boolean;
}) {
  const a11yT = useA11yTranslations();

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <ToolbarButton
        label="Insert image"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        <ImageIcon className="h-4 w-4" />
      </ToolbarButton>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-label={a11yT("imageUpload")}
        onChange={(event) => {
          insertImageFromFile(editor, event.currentTarget.files?.[0]);
          event.currentTarget.value = "";
        }}
      />
    </>
  );
}

function TableContextControls({
  editor,
  disabled,
}: {
  editor: Editor | null;
  disabled: boolean;
}) {
  const inTable = Boolean(editor?.isActive("table"));
  if (!inTable) return null;

  const noBorders = Boolean(editor?.getAttributes("table").noBorders);

  return (
    <ToolbarGroup label="Table">
      <ToolbarButton
        label="Add row above"
        disabled={disabled}
        onClick={() => run(editor, (current) => current.addRowBefore())}
      >
        <Rows3 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Add row below"
        disabled={disabled}
        onClick={() => run(editor, (current) => current.addRowAfter())}
      >
        <Rows3 className="h-4 w-4 rotate-180" />
      </ToolbarButton>
      <ToolbarButton
        label="Add column left"
        disabled={disabled}
        onClick={() => run(editor, (current) => current.addColumnBefore())}
      >
        <Columns3 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Add column right"
        disabled={disabled}
        onClick={() => run(editor, (current) => current.addColumnAfter())}
      >
        <Columns3 className="h-4 w-4 rotate-180" />
      </ToolbarButton>
      <ToolbarButton
        label={noBorders ? "Show table borders" : "Hide table borders"}
        active={noBorders}
        disabled={disabled}
        onClick={() =>
          run(editor, (current) =>
            current.updateAttributes("table", { noBorders: !noBorders }),
          )
        }
      >
        <Minus className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Delete table"
        disabled={disabled}
        onClick={() => run(editor, (current) => current.deleteTable())}
      >
        <Trash2 className="h-4 w-4" />
      </ToolbarButton>
    </ToolbarGroup>
  );
}

function EditorTextControls({
  editor,
  disabled,
}: {
  editor: Editor | null;
  disabled: boolean;
}) {
  return (
    <ToolbarGroup label="Text">
      <ToolbarButton
        label="Bold"
        shortcut="⌘B"
        active={editor?.isActive("bold")}
        disabled={disabled}
        onClick={() => run(editor, (current) => current.toggleBold())}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        shortcut="⌘I"
        active={editor?.isActive("italic")}
        disabled={disabled}
        onClick={() => run(editor, (current) => current.toggleItalic())}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        shortcut="⌘U"
        active={editor?.isActive("underline")}
        disabled={disabled}
        onClick={() => run(editor, (current) => current.toggleUnderline())}
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        shortcut="⌘⇧X"
        active={editor?.isActive("strike")}
        disabled={disabled}
        onClick={() => run(editor, (current) => current.toggleStrike())}
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Subscript"
        shortcut="⌘,"
        active={editor?.isActive("subscript")}
        disabled={disabled}
        onClick={() => run(editor, (current) => current.toggleSubscript())}
      >
        <Subscript className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Superscript"
        shortcut="⌘."
        active={editor?.isActive("superscript")}
        disabled={disabled}
        onClick={() => run(editor, (current) => current.toggleSuperscript())}
      >
        <Superscript className="h-4 w-4" />
      </ToolbarButton>
      <SelectControl
        label="Font family"
        value={String(editor?.getAttributes("textStyle").fontFamily || "")}
        disabled={disabled}
        onChange={(value) =>
          run(editor, (current) =>
            value ? current.setFontFamily(value) : current.unsetFontFamily(),
          )
        }
      >
        <option value="">Font</option>
        {FONT_FAMILIES.map((font) => (
          <option key={font.label} value={font.value}>
            {font.label}
          </option>
        ))}
      </SelectControl>
      <SelectControl
        label="Font size"
        value={String(editor?.getAttributes("textStyle").fontSize || "")}
        disabled={disabled}
        onChange={(value) =>
          run(editor, (current) =>
            value ? current.setFontSize(value) : current.unsetFontSize(),
          )
        }
      >
        <option value="">Size</option>
        {FONT_SIZES.map((size) => (
          <option key={size} value={size}>
            {size.replace("pt", "")}
          </option>
        ))}
      </SelectControl>
      <SelectControl
        label="Text color"
        value=""
        disabled={disabled}
        onChange={(value) =>
          run(editor, (current) =>
            value ? current.setColor(value) : current.unsetColor(),
          )
        }
      >
        <option value="">Color</option>
        {COLOR_SWATCHES.map((color) => (
          <option key={color.label} value={color.value}>
            {color.label}
          </option>
        ))}
      </SelectControl>
      <SelectControl
        label="Highlight color"
        value=""
        disabled={disabled}
        onChange={(value) =>
          run(editor, (current) =>
            value
              ? current.setHighlight({ color: value })
              : current.unsetHighlight(),
          )
        }
      >
        <option value="">Highlight</option>
        {COLOR_SWATCHES.map((color) => (
          <option key={color.label} value={color.value}>
            {color.label}
          </option>
        ))}
      </SelectControl>
      <ToolbarButton
        label="Clear formatting"
        shortcut="⌘\\"
        disabled={disabled}
        onClick={() =>
          run(editor, (current) =>
            current
              .unsetAllMarks()
              .clearNodes()
              .unsetFontFamily()
              .unsetFontSize(),
          )
        }
      >
        <Eraser className="h-4 w-4" />
      </ToolbarButton>
    </ToolbarGroup>
  );
}

function EditorParagraphControls({
  editor,
  disabled,
}: {
  editor: Editor | null;
  disabled: boolean;
}) {
  return (
    <ToolbarGroup label="Paragraph">
      <SelectControl
        label="Paragraph style"
        value={
          editor?.isActive("heading", { level: 1 })
            ? "h1"
            : editor?.isActive("heading", { level: 2 })
              ? "h2"
              : editor?.isActive("heading", { level: 3 })
                ? "h3"
                : "paragraph"
        }
        disabled={disabled}
        onChange={(value) => {
          if (value === "paragraph") {
            run(editor, (current) => current.setParagraph());
            return;
          }
          run(editor, (current) =>
            current.toggleHeading({
              level: Number(value.slice(1)) as 1 | 2 | 3,
            }),
          );
        }}
      >
        <option value="paragraph">Normal</option>
        <option value="h1">H1</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
      </SelectControl>
      {(
        [
          ["Align left", "left", AlignLeft],
          ["Align center", "center", AlignCenter],
          ["Align right", "right", AlignRight],
          ["Justify", "justify", AlignJustify],
        ] as Array<[string, string, ComponentType<{ className?: string }>]>
      ).map(([label, align, Icon]) => (
        <ToolbarButton
          key={String(align)}
          label={String(label)}
          active={editor?.isActive({ textAlign: align })}
          disabled={disabled}
          onClick={() => run(editor, (current) => current.setTextAlign(align))}
        >
          <Icon className="h-4 w-4" />
        </ToolbarButton>
      ))}
      <SelectControl
        label="Line spacing"
        value=""
        disabled={disabled}
        onChange={(value) =>
          run(editor, (current) => current.setLineHeight(value))
        }
      >
        <option value="">Spacing</option>
        {LINE_HEIGHTS.map((lineHeight) => (
          <option key={lineHeight.value} value={lineHeight.value}>
            {lineHeight.label}
          </option>
        ))}
      </SelectControl>
      <ToolbarButton
        label="Bullet list"
        active={editor?.isActive("bulletList")}
        disabled={disabled}
        onClick={() => run(editor, (current) => current.toggleBulletList())}
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor?.isActive("orderedList")}
        disabled={disabled}
        onClick={() => run(editor, (current) => current.toggleOrderedList())}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Outdent"
        disabled={disabled}
        onClick={() =>
          run(editor, (current) => current.liftListItem("listItem"))
        }
      >
        <Outdent className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Indent"
        disabled={disabled}
        onClick={() =>
          run(editor, (current) => current.sinkListItem("listItem"))
        }
      >
        <Indent className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Horizontal rule"
        disabled={disabled}
        onClick={() => run(editor, (current) => current.setHorizontalRule())}
      >
        <Minus className="h-4 w-4" />
      </ToolbarButton>
    </ToolbarGroup>
  );
}

function EditorInsertControls({
  editor,
  disabled,
}: {
  editor: Editor | null;
  disabled: boolean;
}) {
  return (
    <ToolbarGroup label="Insert">
      <ToolbarButton
        label="Link"
        shortcut="⌘K"
        active={editor?.isActive("link")}
        disabled={disabled}
        onClick={() => {
          const previous = String(editor?.getAttributes("link").href || "");
          const href = window.prompt("Link URL", previous);
          if (href === null) return;
          run(editor, (current) =>
            href.trim()
              ? current.extendMarkRange("link").setLink({ href: href.trim() })
              : current.unsetLink(),
          );
        }}
      >
        <Link2 className="h-4 w-4" />
      </ToolbarButton>
      <InsertImageButton editor={editor} disabled={disabled} />
      <TableGridPicker editor={editor} disabled={disabled} />
      <ToolbarButton
        label="Page break"
        disabled={disabled}
        onClick={() =>
          run(editor, (current) => current.insertContent({ type: "pageBreak" }))
        }
      >
        <MoreHorizontal className="h-4 w-4" />
      </ToolbarButton>
      {editor?.isActive("image") && (
        <>
          <ToolbarButton
            label="Reset image size"
            disabled={disabled}
            onClick={() =>
              run(editor, (current) =>
                current.updateAttributes("image", {
                  width: null,
                  height: null,
                  wrap: "inline",
                }),
              )
            }
          >
            <Brush className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Set image width"
            disabled={disabled}
            onClick={() => {
              const currentWidth = String(
                editor.getAttributes("image").width || "",
              );
              const width = window.prompt("Image width", currentWidth);
              if (!width) return;
              run(editor, (current) =>
                current.updateAttributes("image", { width: width.trim() }),
              );
            }}
          >
            <Baseline className="h-4 w-4" />
          </ToolbarButton>
        </>
      )}
    </ToolbarGroup>
  );
}

export function EditorFormattingControls({
  editor,
}: {
  editor: Editor | null;
}) {
  const controlsDisabled = !editor;

  return (
    <>
      <EditorTextControls editor={editor} disabled={controlsDisabled} />
      <ToolbarSeparator />
      <EditorParagraphControls editor={editor} disabled={controlsDisabled} />
      <ToolbarSeparator />
      <EditorInsertControls editor={editor} disabled={controlsDisabled} />
      <TableContextControls editor={editor} disabled={controlsDisabled} />
      <ToolbarSeparator />
      <ToolbarGroup label="History">
        <ToolbarButton
          label="Undo"
          disabled={controlsDisabled}
          onClick={() => run(editor, (current) => current.undo())}
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          disabled={controlsDisabled}
          onClick={() => run(editor, (current) => current.redo())}
        >
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </ToolbarGroup>
    </>
  );
}

export function StudioEditorToolbar({
  editor,
  templates,
  templateId,
  zoomPercent,
  canExport,
  isExporting = false,
  onTemplateChange,
  onZoomChange,
  onDownloadPdf,
  onPrint,
}: EditorToolbarProps) {
  const a11yT = useA11yTranslations();

  const exportDisabled = !canExport || isExporting;

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b bg-background/95 px-4 py-3 shadow-sm backdrop-blur">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <EditorFormattingControls editor={editor} />

        <label className="flex h-10 items-center gap-2 rounded-md border bg-card px-3 text-sm">
          <span className="font-medium">Zoom</span>
          <input
            type="range"
            min={MIN_ZOOM_PERCENT}
            max={MAX_ZOOM_PERCENT}
            step={5}
            value={zoomPercent}
            onChange={(event) =>
              onZoomChange(clampZoomPercent(event.currentTarget.valueAsNumber))
            }
            className="w-28 accent-primary"
            aria-label={a11yT("previewZoom")}
          />
          <span className="w-10 text-right tabular-nums text-muted-foreground">
            {zoomPercent}%
          </span>
        </label>

        <label className="flex h-10 items-center gap-2 rounded-md border bg-card px-3 text-sm">
          <span className="font-medium">Template</span>
          <select
            value={templateId}
            onChange={(event) => onTemplateChange(event.currentTarget.value)}
            className="max-w-40 bg-transparent text-sm outline-none"
            aria-label={a11yT("resumeTemplate")}
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPrint}
          disabled={!canExport}
        >
          <Printer className="h-4 w-4 md:mr-1.5" />
          <span className="hidden md:inline">Print</span>
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onDownloadPdf}
          disabled={exportDisabled}
          className="min-w-[132px]"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin md:mr-1.5" />
          ) : (
            <Download className="h-4 w-4 md:mr-1.5" />
          )}
          <span>Download PDF</span>
        </Button>
      </div>
    </div>
  );
}

export const EditorToolbar = StudioEditorToolbar;
