"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  applyNudges,
  renderHtml,
  getDefaultTemplate,
  DEFAULT_TEMPLATES,
  SAMPLE_SWE,
  COLUMN_LAYOUTS,
  HEADER_STYLES,
  SECTION_TITLE_STYLES,
  BULLET_STYLES,
  DENSITIES,
  FONT_CLASSES,
  ACCENT_PLACEMENTS,
  DATE_ALIGNMENTS,
  type ResumeTemplate,
  type ResumeDocumentModel,
  type TemplateNudges,
} from "@slothing/shared/resume-template";

/**
 * Studio import dialog — the playground's preview + NUDGE + ACCEPT loop, ported into
 * the app (spec §3 Decision 4 / Phase 4). Drop a résumé → the server runs the clone
 * pipeline (XMP self-import → else fingerprint + content extraction) → preview our
 * render, nudge the grammar/tokens live, choose the export engine, and accept to commit
 * the template into the collapsed store. Manual template pick is always available
 * (spec §10 gap #1) — used directly for scanned/foreign-format uploads.
 */

type ExportEngine = "html" | "typeset";

interface ImportResult {
  route: "fingerprint" | "self-import" | "manual";
  scanned: boolean;
  rdm: ResumeDocumentModel | null;
  classification: { template: ResumeTemplate; usedDefaults: string[] } | null;
  suggestedTemplate: ResumeTemplate;
  unknownHeaders: string[];
  sourceFilename?: string;
  sourceType?: string;
}

export interface ImportResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the committed template id after a successful accept. */
  onImported?: (templateId: string, engine: ExportEngine) => void;
}

const FIELD_CLASS =
  "h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground";

export function ImportResumeDialog({
  open,
  onOpenChange,
  onImported,
}: ImportResumeDialogProps) {
  const { addToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [baseTemplateId, setBaseTemplateId] = useState(DEFAULT_TEMPLATES[0].id);
  const [nudges, setNudges] = useState<TemplateNudges>({});
  const [engine, setEngine] = useState<ExportEngine>("html");
  const [name, setName] = useState("");

  const reset = useCallback(() => {
    setResult(null);
    setNudges({});
    setBaseTemplateId(DEFAULT_TEMPLATES[0].id);
    setEngine("html");
    setName("");
  }, []);

  const baseTemplate: ResumeTemplate = useMemo(() => {
    // Fingerprint route synthesizes a base; manual/self-import use a curated default.
    if (result?.classification?.template && result.route === "fingerprint") {
      return result.classification.template;
    }
    return getDefaultTemplate(baseTemplateId) ?? DEFAULT_TEMPLATES[0];
  }, [result, baseTemplateId]);

  const previewTemplate = useMemo(
    () => applyNudges(baseTemplate, nudges),
    [baseTemplate, nudges],
  );
  const previewRdm: ResumeDocumentModel = result?.rdm ?? SAMPLE_SWE;
  const previewHtml = useMemo(
    () => renderHtml(previewTemplate, previewRdm).html,
    [previewTemplate, previewRdm],
  );

  const setGrammar = (key: string, value: string) =>
    setNudges((n) => ({ ...n, grammar: { ...n.grammar, [key]: value } }));
  const setToken = (key: string, value: string) =>
    setNudges((n) => ({ ...n, tokens: { ...n.tokens, [key]: value } }));
  const setTokenNum = (key: string, value: number) =>
    setNudges((n) => ({ ...n, tokens: { ...n.tokens, [key]: value } }));

  const grammarValue = (
    key:
      | "columns"
      | "header"
      | "sectionTitle"
      | "bullets"
      | "density"
      | "dateAlignment",
  ) => nudges.grammar?.[key] ?? baseTemplate.grammar[key] ?? "";
  const accentValue = nudges.tokens?.accent ?? baseTemplate.tokens.accent;
  const fontValue = nudges.tokens?.fontClass ?? baseTemplate.tokens.fontClass;
  const accentPlacementValue =
    nudges.tokens?.accentPlacement ??
    baseTemplate.tokens.accentPlacement ??
    "both";
  const dateAlignmentValue =
    nudges.grammar?.dateAlignment ??
    baseTemplate.grammar.dateAlignment ??
    "right-tab";
  const nameScaleValue =
    nudges.tokens?.nameScale ?? baseTemplate.tokens.nameScale ?? 1;
  const sectionSpacingValue =
    nudges.tokens?.sectionSpacing ?? baseTemplate.tokens.sectionSpacing ?? 1;
  const pageMarginValue =
    nudges.tokens?.pageMarginPt ?? baseTemplate.tokens.pageMarginPt ?? null;

  async function handleFile(file: File) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/templates/import", {
        method: "POST",
        body: formData,
      });
      if (!res.ok)
        throw new Error(
          (await res.json().catch(() => ({})))?.error ?? "Import failed",
        );
      const data = (await res.json()) as ImportResult;
      setResult(data);
      setNudges({});
      setBaseTemplateId(data.suggestedTemplate?.id ?? DEFAULT_TEMPLATES[0].id);
      setName(
        data.sourceFilename?.replace(/\.[^.]+$/, "") ?? "Imported résumé",
      );
      if (data.route === "self-import") {
        addToast({
          title: "Restored from embedded data",
          description: "Exact content recovered — no guessing.",
          type: "success",
        });
      } else if (data.scanned) {
        addToast({
          title: "Scanned PDF",
          description: "No text layer — pick a clean template.",
          type: "info",
        });
      }
    } catch (err) {
      addToast({
        title: "Import failed",
        description: err instanceof Error ? err.message : String(err),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept() {
    setCommitting(true);
    try {
      const res = await fetch("/api/templates/import/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: { ...previewTemplate, name: name || previewTemplate.name },
          rdm: result?.rdm ?? undefined,
          name: name || undefined,
          sourceFilename: result?.sourceFilename,
          sourceType: result?.sourceType,
        }),
      });
      if (!res.ok)
        throw new Error(
          (await res.json().catch(() => ({})))?.error ??
            "Could not save template",
        );
      const saved = (await res.json()) as { id: string };
      addToast({
        title: "Template accepted",
        description: "Saved to your templates.",
        type: "success",
      });
      onImported?.(saved.id, engine);
      reset();
      onOpenChange(false);
    } catch (err) {
      addToast({
        title: "Save failed",
        description: err instanceof Error ? err.message : String(err),
        type: "error",
      });
    } finally {
      setCommitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Import résumé as a template</DialogTitle>
          <DialogDescription>
            Clone your résumé&apos;s style, preview it, nudge the look, then
            accept. Worst case is a clean template that resembles yours — never
            a broken layout.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-rule bg-paper px-6 py-12 text-sm text-ink-3 transition-colors hover:border-brand"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <UploadCloud className="h-6 w-6" />
            )}
            <span>
              {loading ? "Analyzing…" : "Choose a PDF résumé to import"}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,.pdf,.docx,.tex"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />
          </button>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[300px_1fr]">
            <div className="space-y-3 overflow-auto">
              {result.route === "fingerprint" && (
                <p className="text-xs text-ink-3">
                  Style fingerprinted
                  {result.classification?.usedDefaults.length
                    ? `; defaults used for ${result.classification.usedDefaults.join(", ")}`
                    : ""}
                  .
                </p>
              )}
              {(result.route === "manual" || result.scanned) && (
                <div>
                  <Label className="text-xs">Template</Label>
                  <select
                    className={FIELD_CLASS}
                    value={baseTemplateId}
                    onChange={(e) => setBaseTemplateId(e.target.value)}
                  >
                    {DEFAULT_TEMPLATES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <Label className="text-xs">Template name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Accent</Label>
                  <input
                    type="color"
                    className="h-9 w-full rounded-md border border-input bg-background"
                    value={accentValue}
                    onChange={(e) => setToken("accent", e.target.value)}
                  />
                </div>
                <NudgeSelect
                  label="Font"
                  value={fontValue}
                  options={FONT_CLASSES}
                  onChange={(v) => setToken("fontClass", v)}
                />
                <NudgeSelect
                  label="Columns"
                  value={grammarValue("columns")}
                  options={COLUMN_LAYOUTS}
                  onChange={(v) => setGrammar("columns", v)}
                />
                <NudgeSelect
                  label="Header"
                  value={grammarValue("header")}
                  options={HEADER_STYLES}
                  onChange={(v) => setGrammar("header", v)}
                />
                <NudgeSelect
                  label="Section title"
                  value={grammarValue("sectionTitle")}
                  options={SECTION_TITLE_STYLES}
                  onChange={(v) => setGrammar("sectionTitle", v)}
                />
                <NudgeSelect
                  label="Bullets"
                  value={grammarValue("bullets")}
                  options={BULLET_STYLES}
                  onChange={(v) => setGrammar("bullets", v)}
                />
                <NudgeSelect
                  label="Density"
                  value={grammarValue("density")}
                  options={DENSITIES}
                  onChange={(v) => setGrammar("density", v)}
                />
                <NudgeSelect
                  label="Dates"
                  value={dateAlignmentValue}
                  options={DATE_ALIGNMENTS}
                  onChange={(v) => setGrammar("dateAlignment", v)}
                />
                <NudgeSelect
                  label="Accent"
                  value={accentPlacementValue}
                  options={ACCENT_PLACEMENTS}
                  onChange={(v) => setToken("accentPlacement", v)}
                />
                <NudgeRange
                  label="Name size"
                  value={nameScaleValue}
                  min={0.6}
                  max={1.8}
                  step={0.05}
                  format={(n) => `${n.toFixed(2)}×`}
                  onChange={(n) => setTokenNum("nameScale", n)}
                />
                <NudgeRange
                  label="Section spacing"
                  value={sectionSpacingValue}
                  min={0.4}
                  max={2.5}
                  step={0.05}
                  format={(n) => `${n.toFixed(2)}×`}
                  onChange={(n) => setTokenNum("sectionSpacing", n)}
                />
                <NudgeRange
                  label="Page margin"
                  value={pageMarginValue ?? 43}
                  min={18}
                  max={96}
                  step={1}
                  format={(n) =>
                    pageMarginValue == null ? "default" : `${n}pt`
                  }
                  onChange={(n) => setTokenNum("pageMarginPt", n)}
                />
              </div>

              <div>
                <Label className="text-xs">Export engine</Label>
                <div className="flex gap-2">
                  {(["html", "typeset"] as const).map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEngine(e)}
                      className={cn(
                        "flex-1 rounded-md border px-2 py-1.5 text-xs",
                        engine === e
                          ? "border-brand bg-brand-soft text-brand-dark"
                          : "border-input text-ink-3",
                      )}
                    >
                      {e === "html" ? "HTML (WYSIWYG)" : "Typeset"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="min-h-[420px] overflow-hidden rounded-md border border-rule bg-card">
              <iframe
                title="Template preview"
                className="h-[460px] w-full"
                srcDoc={previewHtml}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {result && (
            <Button variant="ghost" onClick={reset} disabled={committing}>
              Choose another file
            </Button>
          )}
          <Button onClick={handleAccept} disabled={!result || committing}>
            {committing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Accept template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NudgeSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <select
        className={FIELD_CLASS}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function NudgeRange({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <Label className="flex items-center justify-between text-xs">
        <span>{label}</span>
        <span className="text-ink-3">{format(value)}</span>
      </Label>
      <input
        type="range"
        className="h-9 w-full accent-brand"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
