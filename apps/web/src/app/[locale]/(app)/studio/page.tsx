"use client";

import { Suspense, useCallback, useMemo } from "react";
import { Loader2, Plus } from "lucide-react";
import { SectionList } from "@/components/builder/section-list";
import { StudioSkeleton } from "@/components/skeletons/studio-skeleton";
import { AiAssistantPanel } from "@/components/studio/ai-assistant-panel";
import { MobileBuilderTabs } from "@/components/studio/mobile-builder-tabs";
import { ResumePreview } from "@/components/studio/resume-preview";
import { StudioFilePanel } from "@/components/studio/studio-file-panel";
import { StudioHeader } from "@/components/studio/studio-header";
import { useStudioKeyboardShortcuts } from "@/components/studio/use-studio-keyboard-shortcuts";
import { useStudioPageState } from "@/components/studio/use-studio-page-state";
import { VersionDiffView } from "@/components/studio/version-diff-view";
import { VersionHistorySection } from "@/components/studio/version-history-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageWorkspace } from "@/components/ui/page-layout";
import { getMobilePanelClasses } from "@/lib/builder/section-manager";
import { cn } from "@/lib/utils";

function StudioPageContent() {
  const studio = useStudioPageState();
  const { setAiPanelCollapsed, setExportMenuOpen } = studio;
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
  const handleShortcutExport = useCallback(() => {
    setExportMenuOpen(true);
  }, [setExportMenuOpen]);
  const handleShortcutFocusAiInput = useCallback(() => {
    setAiPanelCollapsed(false);
    window.requestAnimationFrame(() => {
      document.getElementById("studio-jd-input")?.focus();
    });
  }, [setAiPanelCollapsed]);

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
      <StudioHeader
        documentMode={studio.documentMode}
        draftIsSaved={studio.draftIsSaved}
        saveStatus={studio.saveStatus}
        templateId={studio.templateId}
        canCopyHtml={Boolean(studio.content || studio.html)}
        canDownloadDocx={Boolean(studio.content || studio.html)}
        canDownloadPdf={Boolean(studio.content || studio.html)}
        exportMenuOpen={studio.exportMenuOpen}
        isExporting={studio.isExporting}
        onDocumentModeChange={studio.setDocumentMode}
        onAiPanelToggle={() => studio.setMobileView("assistant")}
        onFilesPanelToggle={() => studio.setMobileView("edit")}
        onExportMenuOpenChange={studio.setExportMenuOpen}
        onTemplateSelect={studio.handleTemplateSelect}
        onCopyHtml={studio.handleCopyHtml}
        onDownloadDocx={studio.handleDownloadDocx}
        onDownloadPdf={studio.handleDownloadPdf}
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
              studio.filesPanelCollapsed ? "md:w-12" : "md:w-[280px]",
              getMobilePanelClasses(studio.mobileView, "edit"),
            )}
          >
            <StudioFilePanel
              documents={studio.currentDocuments}
              activeDocumentId={studio.activeDocumentId}
              onCreate={studio.handleCreateDocument}
              onSelect={studio.handleSelectDocument}
              onRename={studio.handleRenameDocument}
              onDelete={studio.handleDeleteDocument}
              collapsed={studio.filesPanelCollapsed}
              onToggleCollapsed={studio.toggleFilesPanelCollapsed}
            />

            {!studio.filesPanelCollapsed && (
              <>
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
            )}
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
            <ResumePreview
              templateId={studio.templateId}
              html={studio.html}
              documentMode={studio.documentMode}
              onAddFromBank={() => studio.setEntryPickerOpen(true)}
              content={studio.content}
              onContentChange={studio.handleContentChange}
              pageSettings={studio.pageSettings}
              onPageSettingsChange={studio.handlePageSettingsChange}
            />
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
