"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import type { Editor } from "@tiptap/react";
import { Loader2, Plus } from "lucide-react";
import { SectionList } from "@/components/builder/section-list";
import { StudioSkeleton } from "@/components/skeletons/studio-skeleton";
import { AiAssistantPanel } from "@/components/studio/ai-assistant-panel";
import { MobileBuilderTabs } from "@/components/studio/mobile-builder-tabs";
import { ResumePreview } from "@/components/studio/resume-preview";
import { StudioFilePanel } from "@/components/studio/studio-file-panel";
import {
  StudioCanvas,
  type CanvasMode,
} from "@/components/studio/studio-canvas";
import {
  StudioLeftRail,
  type LeftRailTab,
} from "@/components/studio/studio-left-rail";
import { StudioSubBar } from "@/components/studio/studio-sub-bar";
import { useStudioKeyboardShortcuts } from "@/components/studio/use-studio-keyboard-shortcuts";
import { useStudioPageState } from "@/components/studio/use-studio-page-state";
import { VersionDiffView } from "@/components/studio/version-diff-view";
import { VersionHistorySection } from "@/components/studio/version-history-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageWorkspace } from "@/components/ui/page-layout";
import { useToast } from "@/components/ui/toast";
import { getMobilePanelClasses } from "@/lib/builder/section-manager";
import { cn } from "@/lib/utils";

function StudioPageContent() {
  const studio = useStudioPageState();
  const { setAiPanelCollapsed, setExportMenuOpen } = studio;
  const [editor, setEditor] = useState<Editor | null>(null);
  const [leftRailTab, setLeftRailTab] = useState<LeftRailTab>("files");
  const [canvasMode, setCanvasMode] = useState<CanvasMode>("wysiwyg");
  const { addToast } = useToast();
  const compareVersion = useMemo(
    () =>
      studio.versions.find(
        (version) => version.id === studio.compareVersionId,
      ) ?? null,
    [studio.compareVersionId, studio.versions],
  );
  const documentIsEmpty = !studio.content && !studio.html;
  const hasBankEntries = studio.entries.length > 0;
  const isFirstRunSelectionState =
    documentIsEmpty && hasBankEntries && studio.selectedIds.size === 0;
  const activeDocumentName = useMemo(
    () =>
      studio.currentDocuments.find((d) => d.id === studio.activeDocumentId)
        ?.name ?? "Untitled",
    [studio.activeDocumentId, studio.currentDocuments],
  );
  const coverLetterCount = useMemo(
    () => studio.documents.filter((d) => d.mode === "cover_letter").length,
    [studio.documents],
  );
  const handleShortcutExport = useCallback(() => {
    setExportMenuOpen(true);
  }, [setExportMenuOpen]);
  const handleShortcutFocusAiInput = useCallback(() => {
    setAiPanelCollapsed(false);
    window.requestAnimationFrame(() => {
      document.getElementById("studio-jd-input")?.focus();
    });
  }, [setAiPanelCollapsed]);
  const handleTailorAi = useCallback(() => {
    setAiPanelCollapsed(false);
    window.requestAnimationFrame(() => {
      document.getElementById("studio-jd-input")?.focus();
    });
  }, [setAiPanelCollapsed]);
  const handleExportPlainText = useCallback(() => {
    const stripped = (studio.html ?? "")
      .replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    if (!stripped) {
      addToast({
        type: "warning",
        title: "Nothing to export",
        description: "Add content before exporting plain text.",
      });
      return;
    }
    const blob = new Blob([stripped], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeDocumentName.replace(/[^a-z0-9-_ ]/gi, "").trim() || "document"}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [activeDocumentName, addToast, studio.html]);
  const handleOpenVersionHistory = useCallback(() => {
    studio.setFilesPanelCollapsed(false);
    window.requestAnimationFrame(() => {
      document
        .getElementById("studio-version-history")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [studio]);

  useStudioKeyboardShortcuts({
    onSave: studio.handleSaveManualVersion,
    onExport: handleShortcutExport,
    onToggleAiPanel: studio.toggleAiPanelCollapsed,
    onFocusAiInput: handleShortcutFocusAiInput,
    onToggleFilesPanel: studio.toggleFilesPanelCollapsed,
    onTogglePreviewOnly: studio.togglePreviewOnly,
  });

  if (studio.loading) {
    return <StudioSkeleton />;
  }

  return (
    <PageWorkspace>
      <StudioSubBar
        documentMode={studio.documentMode}
        onDocumentModeChange={studio.setDocumentMode}
        coverLetterCount={coverLetterCount}
        activeDocumentId={studio.activeDocumentId}
        activeDocumentName={activeDocumentName}
        onRename={studio.handleRenameDocument}
        saveStatus={studio.saveStatus}
        draftIsSaved={studio.draftIsSaved}
        versionsCount={studio.versions.length}
        onOpenVersionHistory={handleOpenVersionHistory}
        editor={editor}
        templateId={studio.templateId}
        onTemplateSelect={studio.handleTemplateSelect}
        onTailorAi={handleTailorAi}
        exportMenuOpen={studio.exportMenuOpen}
        onExportMenuOpenChange={studio.setExportMenuOpen}
        isExporting={studio.isExporting}
        canCopyHtml={Boolean(studio.content || studio.html)}
        canDownloadDocx={Boolean(studio.content || studio.html)}
        canDownloadPdf={Boolean(studio.content || studio.html)}
        onDownloadPdf={studio.handleDownloadPdf}
        onDownloadDocx={studio.handleDownloadDocx}
        onCopyHtml={studio.handleCopyHtml}
        onExportPlainText={handleExportPlainText}
        onAiPanelToggle={() => studio.setMobileView("assistant")}
        onFilesPanelToggle={() => studio.setMobileView("edit")}
      />

      <div className="flex min-h-0 flex-1 flex-col">
        <MobileBuilderTabs
          mobileView={studio.mobileView}
          onMobileViewChange={studio.setMobileView}
        />

        <div className="flex flex-1 overflow-hidden">
          <div
            id="builder-edit-panel"
            role="tabpanel"
            aria-labelledby="builder-edit-tab"
            className={cn(
              "w-full overflow-y-auto transition-[width] duration-200 md:flex-none md:shrink-0 md:border-r",
              studio.filesPanelCollapsed ? "md:w-12" : "md:w-[300px]",
              getMobilePanelClasses(studio.mobileView, "edit"),
            )}
          >
            <StudioLeftRail
              activeTab={leftRailTab}
              onTabChange={setLeftRailTab}
              collapsed={studio.filesPanelCollapsed}
              onToggleCollapsed={studio.toggleFilesPanelCollapsed}
              filesContent={
                <>
                  <StudioFilePanel
                    documents={studio.currentDocuments}
                    activeDocumentId={studio.activeDocumentId}
                    onCreate={studio.handleCreateDocument}
                    onSelect={studio.handleSelectDocument}
                    onRename={studio.handleRenameDocument}
                    onDelete={studio.handleDeleteDocument}
                  />
                  <VersionHistorySection
                    versions={studio.versions}
                    previewVersionId={studio.previewVersionId}
                    manualVersionName={studio.manualVersionName}
                    onCompareVersion={studio.handleCompareVersion}
                    onPreviewVersion={studio.handlePreviewVersion}
                    onManualVersionNameChange={studio.setManualVersionName}
                    onSaveVersion={studio.handleSaveManualVersion}
                  />

                  <div className="flex-1 overflow-y-auto">
                    {studio.stagedSelectionCount > 0 ? (
                      <div className="border-b px-4 py-3">
                        <Badge variant="success">
                          Using {studio.stagedSelectionCount} staged bank
                          component
                          {studio.stagedSelectionCount === 1 ? "" : "s"}
                        </Badge>
                      </div>
                    ) : null}
                    <SectionList
                      sections={studio.sections}
                      entries={studio.entries}
                      selectedIds={studio.selectedIds}
                      onReorder={studio.handleReorder}
                      onToggleVisibility={studio.handleToggleVisibility}
                      onToggleEntry={studio.handleToggleEntry}
                      pickerOpen={studio.entryPickerOpen}
                      onPickerOpenChange={studio.setEntryPickerOpen}
                      showSections={studio.documentMode === "resume"}
                      emptySelectionHint={
                        isFirstRunSelectionState
                          ? "Select entries to build your first draft."
                          : undefined
                      }
                    />
                    <div className="px-4 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => studio.setEntryPickerOpen(true)}
                      >
                        <Plus className="mr-1.5 h-4 w-4" />
                        {isFirstRunSelectionState
                          ? "Open bank picker"
                          : "Add from bank"}
                      </Button>
                    </div>
                  </div>
                </>
              }
              filesCount={studio.currentDocuments.length}
              entries={studio.entries}
              selectedEntryIds={studio.selectedIds}
              onToggleEntry={studio.handleToggleEntry}
              onOpenBankPicker={() => studio.setEntryPickerOpen(true)}
              linkedOpportunityId={studio.linkedOpportunityId}
              onLinkOpportunity={(opportunity) =>
                studio.setLinkedOpportunityId(opportunity.id)
              }
            />
          </div>

          <div
            id="builder-preview-panel"
            role="tabpanel"
            aria-labelledby="builder-preview-tab"
            data-document-editor-root="true"
            className={cn(
              "relative w-full flex-1 overflow-auto",
              getMobilePanelClasses(studio.mobileView, "preview"),
            )}
          >
            {studio.generating && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            <StudioCanvas
              mode={canvasMode}
              onModeChange={setCanvasMode}
              content={studio.content}
              html={studio.html}
            >
              <ResumePreview
                templateId={studio.templateId}
                html={studio.html}
                documentMode={studio.documentMode}
                onAddFromBank={() => studio.setEntryPickerOpen(true)}
                content={studio.content}
                onContentChange={studio.handleContentChange}
                pageSettings={studio.pageSettings}
                onPageSettingsChange={studio.handlePageSettingsChange}
                onEditorReady={setEditor}
              />
            </StudioCanvas>
          </div>

          <AiAssistantPanel
            id="builder-assistant-panel"
            role="tabpanel"
            aria-labelledby="builder-assistant-tab"
            className={getMobilePanelClasses(studio.mobileView, "assistant")}
            documentContent={studio.html}
            documentMode={studio.documentMode}
            selectedEntryCount={studio.selectedIds.size}
            selectedEntryIds={Array.from(studio.selectedIds)}
            coverLetterCritique={studio.coverLetterCritique}
            onCoverLetterCritique={studio.handleCoverLetterCritique}
            onCoverLetterGenerated={studio.handleCoverLetterGenerated}
            onCoverLetterSuggestionApply={
              studio.handleCoverLetterSuggestionApply
            }
            onGenerateFromBank={studio.handleGenerateFromBank}
            onOpenBank={() => studio.setEntryPickerOpen(true)}
            onOpportunityClear={() => studio.setLinkedOpportunityId("")}
            onOpportunitySelect={studio.setLinkedOpportunityId}
            collapsed={studio.aiPanelCollapsed}
            onToggleCollapsed={studio.toggleAiPanelCollapsed}
          />
        </div>
      </div>
      <VersionDiffView
        currentDraftState={studio.currentDraftState}
        onOpenChange={(open) => {
          if (!open) studio.handleCloseVersionDiff();
        }}
        open={Boolean(compareVersion)}
        version={compareVersion}
      />
    </PageWorkspace>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={<StudioSkeleton />}>
      <StudioPageContent />
    </Suspense>
  );
}
