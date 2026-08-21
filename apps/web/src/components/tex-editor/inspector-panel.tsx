"use client";

/**
 * The inspector — the right pane.
 *
 * Two states over one persistent panel, the canonical inspector pattern (Figma, Xcode IB,
 * DevTools). Nothing selected shows DOCUMENT controls: settings, structure, actions. That
 * default is deliberately useful rather than a "nothing selected" placeholder.
 *
 * The panel's width never changes with selection — a canvas that reflows on every click
 * is the cheapest-feeling thing an editor can do.
 */
import { ChevronRight, Download, FileText, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  breadcrumbFor,
  fieldsFor,
  flattenOutline,
  type DocumentModel,
  type OutlineNode,
} from "@/lib/latex/document-model";
import type { FieldWrite } from "@/lib/latex/field-edit";
import type { DocumentSettings } from "@/lib/latex/settings";
import type { InlineViolation } from "@/lib/latex/inline";
import { pluralize } from "@/lib/text/pluralize";
import { cn } from "@/lib/utils";

import { FieldEditor } from "./field-editor";

const FONTS: DocumentSettings["font"][] = [
  "LatinModern",
  "Times",
  "Helvetica",
  "Palatino",
];
const SIZES: DocumentSettings["fontsize"][] = ["10pt", "11pt", "12pt"];
const MARGINS = ["0.4in", "0.5in", "0.65in", "0.75in", "1in"];

export interface InspectorPanelProps {
  model: DocumentModel;
  selectedSpanId: string | null;
  fieldViolations: Record<string, InlineViolation[]>;
  settingsError: string | null;
  onSelect: (spanId: string | null) => void;
  onEditField: (
    spanId: string,
    fieldIndex: number,
    write: FieldWrite,
  ) => boolean;
  onEditSettings: (settings: DocumentSettings) => void;
  onCommit: () => void;
  onDownload: () => void;
  downloadDisabled?: boolean;
}

function OutlineRow({
  node,
  depth,
  selectedSpanId,
  onSelect,
}: {
  node: OutlineNode;
  depth: number;
  selectedSpanId: string | null;
  onSelect: (spanId: string) => void;
}) {
  const isSelected = node.spanId === selectedSpanId;
  return (
    <>
      <button
        type="button"
        onClick={() => onSelect(node.spanId)}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
        className={cn(
          "flex w-full items-center gap-2 rounded-sm py-1.5 pr-2 text-left text-[13px] transition-colors",
          isSelected
            ? "bg-brand-soft text-ink"
            : "text-ink-2 hover:bg-page-2 hover:text-ink",
        )}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-3">
          {node.kind.slice(0, 3)}
        </span>
        <span className="min-w-0 flex-1 truncate">{node.label}</span>
      </button>
      {node.children.map((child) => (
        <OutlineRow
          key={child.spanId}
          node={child}
          depth={depth + 1}
          selectedSpanId={selectedSpanId}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

function SettingRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (next: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[13px] text-ink-2">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-label={label} className="h-8 w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function InspectorPanel({
  model,
  selectedSpanId,
  fieldViolations,
  settingsError,
  onSelect,
  onEditField,
  onEditSettings,
  onCommit,
  onDownload,
  downloadDisabled,
}: InspectorPanelProps) {
  const fields = fieldsFor(model, selectedSpanId);
  const trail = breadcrumbFor(model, selectedSpanId);
  const spanCount = flattenOutline(model.outline).length;

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-l border-rule bg-paper">
      <header className="flex min-h-12 items-center gap-2 border-b border-rule px-4 py-3">
        {selectedSpanId ? (
          <nav
            aria-label="Selected element"
            className="flex min-w-0 flex-1 items-center gap-1 text-[12.5px]"
          >
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="shrink-0 text-ink-3 transition-colors hover:text-ink"
            >
              Document
            </button>
            {trail.map((node) => (
              <span
                key={node.spanId}
                className="flex min-w-0 items-center gap-1"
              >
                <ChevronRight className="h-3 w-3 shrink-0 text-ink-3" />
                <span className="truncate text-ink">{node.label}</span>
              </span>
            ))}
          </nav>
        ) : (
          <>
            <Settings2 className="h-4 w-4 shrink-0 text-ink-3" />
            <h2 className="font-display text-[15px] font-semibold tracking-tight text-ink">
              Document
            </h2>
          </>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {selectedSpanId ? (
          <div className="space-y-5 px-4 py-4">
            {fields.length === 0 ? (
              <p className="text-[13px] text-ink-3">
                This element has no editable fields.
              </p>
            ) : (
              fields.map((field, index) => (
                <FieldEditor
                  key={`${selectedSpanId}-${field.index}`}
                  spanId={selectedSpanId}
                  field={field}
                  violations={
                    fieldViolations[`${selectedSpanId}:${field.index}`] ?? []
                  }
                  autoFocus={index === 0}
                  onChange={(write) =>
                    onEditField(selectedSpanId, field.index, write)
                  }
                  onCommit={onCommit}
                />
              ))
            )}
          </div>
        ) : (
          <div className="divide-y divide-rule">
            <section className="space-y-3 px-4 py-4">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
                Style
              </h3>
              {settingsError ? (
                <p className="text-[12.5px] text-destructive">
                  {settingsError}
                </p>
              ) : model.settings.ok ? (
                <div className="space-y-2.5">
                  <SettingRow
                    label="Font"
                    value={model.settings.value.font}
                    options={FONTS}
                    onChange={(font) =>
                      model.settings.ok &&
                      onEditSettings({
                        ...model.settings.value,
                        font: font as DocumentSettings["font"],
                      })
                    }
                  />
                  <SettingRow
                    label="Size"
                    value={model.settings.value.fontsize}
                    options={SIZES}
                    onChange={(fontsize) =>
                      model.settings.ok &&
                      onEditSettings({
                        ...model.settings.value,
                        fontsize: fontsize as DocumentSettings["fontsize"],
                      })
                    }
                  />
                  <SettingRow
                    label="Margin"
                    value={model.settings.value.margin}
                    options={MARGINS}
                    onChange={(margin) =>
                      model.settings.ok &&
                      onEditSettings({ ...model.settings.value, margin })
                    }
                  />
                </div>
              ) : (
                <p className="text-[12.5px] text-destructive">
                  {model.settings.error}
                </p>
              )}
            </section>

            <section className="px-2 py-4">
              <h3 className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
                Structure · {pluralize(spanCount, "element")}
              </h3>
              <div className="space-y-0.5">
                {model.outline.map((node) => (
                  <OutlineRow
                    key={node.spanId}
                    node={node}
                    depth={0}
                    selectedSpanId={selectedSpanId}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      <footer className="border-t border-rule px-4 py-3">
        <Button
          type="button"
          className="w-full"
          onClick={onDownload}
          disabled={downloadDisabled}
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-ink-3">
          <FileText className="h-3 w-3" />
          Saves before exporting.
        </p>
      </footer>
    </aside>
  );
}
