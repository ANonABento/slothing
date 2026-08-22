"use client";

/**
 * The editor shell — two panes over one document.
 *
 * Layout rule: the panel's width is driven by a persisted ratio and NEVER changes with
 * selection. A canvas that reflows every time you click something is the cheapest-feeling
 * thing an editor can do.
 */
import { useCallback, useEffect } from "react";

import { exportDownloadUrl } from "./tex-editor-api";
import { CompileStatusBar } from "./compile-status-bar";
import { DocumentHeader } from "./document-header";
import { InspectorPanel } from "./inspector-panel";
import { TexPdfCanvas } from "./tex-pdf-canvas";
import { useSplitPane } from "./use-split-pane";
import {
  isCompileSuspended,
  isDirty,
  previewIsStale,
} from "./tex-editor-state";
import {
  useTexEditor,
  type TexEditorInitialDocument,
  type TexEditorRuntime,
} from "./use-tex-editor";

export interface TexEditorProps {
  document: TexEditorInitialDocument;
  runtime?: TexEditorRuntime;
}

export function TexEditor({ document, runtime }: TexEditorProps) {
  const editor = useTexEditor(document, runtime);
  const { state, model } = editor;

  const { containerRef, dragging, handleProps } = useSplitPane(
    state.ui.splitRatio,
    editor.setSplitRatio,
  );

  // Compile once on mount so the document is on screen without needing an edit.
  // `commit` only flushes a PENDING debounce, so it is not enough here.
  useEffect(() => {
    editor.compileNow();
    // Intentionally once, for the initial render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = useCallback(async () => {
    // Export always saves first, so the saved-source cache key matches what is served.
    await editor.commit();
    window.open(exportDownloadUrl(document.id), "_blank", "noopener");
  }, [document.id, editor]);

  const busy =
    state.preview.phase.status === "compiling" ||
    state.preview.phase.status === "fetching";

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <DocumentHeader
        documentId={document.id}
        initialTitle={document.title}
        initialKind={document.kind}
        saving={state.save.status === "saving"}
        dirty={isDirty(state)}
      />

      <div
        ref={containerRef}
        className="flex min-h-0 w-full flex-1 flex-col lg:flex-row"
      >
        <div
          className="flex min-h-0 min-w-0 flex-1 flex-col"
          style={{ flexBasis: `${state.ui.splitRatio * 100}%` }}
        >
          <CompileStatusBar
            busy={busy}
            problem={state.preview.problem}
            suspended={isCompileSuspended(state)}
            onRetry={editor.retryCompile}
          />
          <div className="min-h-0 flex-1">
            <TexPdfCanvas
              pending={editor.pendingBytes}
              hitMap={state.preview.displayed?.hitMap ?? null}
              selectedSpanId={state.selection.spanId}
              onSelectSpan={(spanId) => editor.select(spanId, 0, "canvas")}
              onRendered={editor.notifyRendered}
              onRenderFailed={editor.notifyRenderFailed}
              zoom={state.ui.zoom}
              onZoomChange={editor.setZoom}
              stale={previewIsStale(state)}
            />
          </div>
        </div>

        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panels"
          tabIndex={0}
          {...handleProps}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              editor.setSplitRatio(Math.max(0.35, state.ui.splitRatio - 0.02));
            }
            if (event.key === "ArrowRight") {
              editor.setSplitRatio(Math.min(0.8, state.ui.splitRatio + 0.02));
            }
          }}
          className={
            dragging
              ? "hidden w-1 shrink-0 cursor-col-resize bg-brand lg:block"
              : "hidden w-1 shrink-0 cursor-col-resize bg-rule transition-colors hover:bg-brand lg:block"
          }
        />

        <div
          className="min-h-0 min-w-0 flex-1"
          style={{ flexBasis: `${(1 - state.ui.splitRatio) * 100}%` }}
        >
          <InspectorPanel
            model={model}
            selectedSpanId={state.selection.spanId}
            fieldViolations={state.fieldViolations}
            settingsError={state.settingsError}
            onSelect={(spanId) =>
              editor.select(spanId, spanId ? 0 : null, "outline")
            }
            onEditField={editor.editField}
            onEditSettings={editor.editSettings}
            onCommit={() => void editor.commit("field edit")}
            onDownload={() => void handleDownload()}
            downloadDisabled={isCompileSuspended(state)}
            onRequestAi={editor.requestAi}
            onRequestAnnotate={editor.requestAnnotate}
            onApplyAnnotation={editor.applyAnnotation}
          />
        </div>
      </div>
    </div>
  );
}
