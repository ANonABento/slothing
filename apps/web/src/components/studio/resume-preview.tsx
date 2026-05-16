"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import { FileText, PenLine, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeEditor } from "@/lib/editor/resume-editor";
import { EditorFormattingControls } from "@/components/studio/editor-toolbar";
import { EditorPageSettings } from "@/components/studio/editor-page-settings";
import { TailorDiffView } from "@/components/tailor/diff-view";
import { createTailorDiff } from "@/lib/tailor/diff";
import {
  DEFAULT_PAGE_SETTINGS,
  PAGE_SIZES,
  normalizePageSettings,
  pageSettingsToCssVariables,
  type PageSettings,
} from "@/lib/editor/page-settings";
import { getTemplateForDocumentMode } from "@/lib/resume/template-data";
import type {
  CoverLetterTemplateStyles,
  TemplateStyles,
} from "@/lib/resume/template-data";
import type { TipTapJSONContent } from "@/lib/editor/types";
import type { TailoredResume } from "@/lib/resume/generator";
import type { DocumentMode } from "./studio-documents";

const PAGE_WIDTH_PX = 816; // 8.5in at 96dpi
const PX_PER_IN = 96;

function coverLetterStylesToEditorTemplateStyles(
  styles: CoverLetterTemplateStyles,
): TemplateStyles {
  return {
    fontFamily: styles.fontFamily,
    fontSize: styles.fontSize,
    headerSize: styles.headerSize,
    sectionHeaderSize: "13pt",
    lineHeight: styles.lineHeight,
    accentColor: styles.accentColor,
    layout: "single-column",
    headerStyle: styles.headerStyle,
    bulletStyle: "disc",
    sectionDivider: "none",
  };
}

export interface ResumePreviewProps {
  templateId: string;
  html?: string;
  content?: TipTapJSONContent;
  documentMode?: DocumentMode;
  onContentChange?: (content: TipTapJSONContent) => void;
  pageSettings?: PageSettings;
  onPageSettingsChange?: (pageSettings: PageSettings) => void;
  onAddSection?: () => void;
  onAddFromBank?: () => void;
  baseResume?: TailoredResume;
  tailoredResume?: TailoredResume;
  /**
   * Optional editor passthrough — when set, the editor instance produced
   * by the inner ResumeEditor is also forwarded here. The page hoists this
   * up to drive sub-bar undo/redo (`StudioSubBar`).
   */
  onEditorReady?: (editor: Editor | null) => void;
}

interface PreviewEmptyStateContent {
  eyebrow: string;
  heading: string;
  description: string;
  steps: string[];
}

export function getPreviewEmptyStateContent(
  documentMode: DocumentMode = "resume",
): PreviewEmptyStateContent {
  if (documentMode === "cover_letter") {
    return {
      eyebrow: "Cover Letter",
      heading: "Select entries from your bank",
      description:
        "Choose the saved experience you want to feature first. Then add a job description or use AI to shape the draft.",
      steps: [
        "Pick the bank entries to include",
        "Add job details when you are ready",
        "Preview and edit the cover letter",
      ],
    };
  }

  return {
    eyebrow: "Resume",
    heading: "Select entries from your bank",
    description:
      "Choose the saved experience, skills, and projects to include. The preview will build from those selections.",
    steps: [
      "Pick the bank entries to include",
      "Review the generated preview",
      "Edit and export your resume",
    ],
  };
}

export function ResumePreview({
  templateId,
  html,
  content,
  documentMode = "resume",
  onContentChange,
  pageSettings = DEFAULT_PAGE_SETTINGS,
  onPageSettingsChange,
  onAddSection,
  onAddFromBank,
  baseResume,
  tailoredResume,
  onEditorReady,
}: ResumePreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [editor, setEditorState] = useState<Editor | null>(null);
  const setEditor = useCallback(
    (next: Editor | null) => {
      setEditorState(next);
      onEditorReady?.(next);
    },
    [onEditorReady],
  );
  const [showDiff, setShowDiff] = useState(false);

  const template = getTemplateForDocumentMode(documentMode, templateId);
  const isCoverLetter = documentMode === "cover_letter";
  const templateStyles =
    template.styles.layout === "letter"
      ? coverLetterStylesToEditorTemplateStyles(template.styles)
      : template.styles;
  const accentColor = template.styles.accentColor;
  const fontFamily =
    template.styles.fontFamily ?? "'Helvetica Neue', Arial, sans-serif";
  const normalizedPageSettings = normalizePageSettings(pageSettings);
  const pageSize = PAGE_SIZES[normalizedPageSettings.size];
  const pageWidthPx = pageSize.widthIn * PX_PER_IN;
  const pageHeightPx = pageSize.heightIn * PX_PER_IN;

  const updateScale = useCallback(() => {
    if (!wrapperRef.current) return;
    const availableWidth = wrapperRef.current.clientWidth - 48; // minus padding
    if (availableWidth < pageWidthPx) {
      setFitScale(Math.max(availableWidth, 1) / pageWidthPx);
    } else {
      setFitScale(1);
    }
  }, [pageWidthPx]);

  useEffect(() => {
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [updateScale]);

  const zoomPercent = 100;
  const scale = fitScale * (zoomPercent / 100);
  const emptyStateContent = getPreviewEmptyStateContent(documentMode);
  const EmptyStateIcon = documentMode === "cover_letter" ? PenLine : FileText;
  const diff =
    documentMode === "resume" && baseResume && tailoredResume
      ? createTailorDiff(baseResume, tailoredResume)
      : null;

  return (
    <div ref={wrapperRef} className="h-full overflow-auto bg-muted/30 p-4">
      {content && (
        <div className="sticky top-0 z-20 mx-auto mb-3 flex w-fit max-w-full flex-wrap items-center gap-2 rounded-md border bg-background/95 p-2 shadow-sm backdrop-blur">
          {diff && (
            <Button
              type="button"
              variant={showDiff ? "default" : "outline"}
              size="sm"
              onClick={() => setShowDiff((current) => !current)}
              aria-pressed={showDiff}
            >
              View changes
            </Button>
          )}
          {!showDiff && <EditorFormattingControls editor={editor} />}
          {onPageSettingsChange && (
            <EditorPageSettings
              pageSettings={normalizedPageSettings}
              onChange={onPageSettingsChange}
            />
          )}
        </div>
      )}
      <div
        className="mx-auto"
        style={{
          width: `${pageWidthPx * scale}px`,
          minHeight: `${pageHeightPx * scale}px`,
        }}
      >
        <article
          className="tiptap-page border-[length:var(--border-width)] border-paper-border bg-paper text-paper-foreground shadow-[var(--shadow-elevated)]"
          style={{
            ...pageSettingsToCssVariables(normalizedPageSettings),
            width: `${pageWidthPx}px`,
            minHeight: `${pageHeightPx}px`,
            fontFamily,
            borderTop: isCoverLetter ? undefined : `4px solid ${accentColor}`,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
        >
          {showDiff && diff ? (
            <div className="px-12 py-10">
              <TailorDiffView diff={diff} />
            </div>
          ) : content ? (
            <>
              <ResumeEditor
                content={content}
                templateStyles={templateStyles}
                variant={isCoverLetter ? "cover_letter" : "resume"}
                editable
                onUpdate={onContentChange}
                onEditorReady={setEditor}
              />
              {onAddSection && (
                <div className="px-12 pb-12">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-10 w-full border-[length:var(--border-width)] border-dashed border-border text-muted-foreground hover:border-primary hover:bg-primary/5 hover:text-primary"
                    onClick={onAddSection}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section
                  </Button>
                </div>
              )}
            </>
          ) : html ? (
            <div
              className={isCoverLetter ? undefined : "px-14 py-12"}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <div className="flex min-h-[11in] items-center justify-center px-14 py-16 text-paper-foreground">
              <div className="w-full max-w-md text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <EmptyStateIcon className="h-8 w-8" aria-hidden="true" />
                </div>
                <p className="text-xs font-semibold uppercase text-primary">
                  {emptyStateContent.eyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  {emptyStateContent.heading}
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-paper-foreground/60">
                  {emptyStateContent.description}
                </p>

                <ol className="mt-7 space-y-2 text-left">
                  {emptyStateContent.steps.map((step, index) => (
                    <li
                      key={step}
                      className="flex items-center gap-3 rounded-md bg-muted/40 px-4 py-3 text-sm text-paper-foreground/70"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1">{step}</span>
                    </li>
                  ))}
                </ol>

                <Button
                  type="button"
                  size="lg"
                  className="mt-7 gradient-bg text-primary-foreground hover:opacity-90"
                  onClick={onAddFromBank}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Select entries from your bank
                </Button>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
