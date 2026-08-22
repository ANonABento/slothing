"use client";

/**
 * The Studio document list.
 *
 * `/studio` used to be the TipTap editor. It is now the way in to the LaTeX editor:
 * create a document, upload one you already have, or open something you were working on.
 *
 * It is also where documents are MANAGED — renamed, duplicated, deleted, relabelled. The
 * first version of this list could only open things, which meant a mistyped name or a
 * stray duplicate was permanent from the user's point of view.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FileText, Loader2, Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { StandardEmptyState } from "@/components/ui/page-layout";
import { useToast } from "@/components/ui/toast";
import { useErrorToast } from "@/hooks/use-error-toast";
import { useRouter } from "@/i18n/navigation";
import type { TexDocumentKind } from "@/lib/db/tex-documents";
import { detectDocumentKind } from "@/lib/latex/detect-kind";
import { readJsonResponse } from "@/lib/http";
import {
  DEFAULT_DOCUMENT_DEFAULTS,
  readStudioDefaults,
  readStudioSort,
  readStudioView,
  writeStudioDefaults,
  writeStudioSort,
  writeStudioView,
  type StudioDocumentDefaults,
  type StudioSort,
  type StudioView,
} from "@/lib/studio/preferences";
import { pluralize } from "@/lib/text/pluralize";

import { DocumentCard } from "./document-card";
import { DocumentRow } from "./document-row";
import { ImportDialog, type PendingImport } from "./import-dialog";
import {
  NewDocumentDialog,
  type NewDocumentSource,
} from "./new-document-dialog";
import { StudioDefaultsPanel } from "./studio-defaults-panel";
import { StudioToolbar } from "./studio-toolbar";
import { countByKind, filterAndSortDocuments } from "./filter";
import type { TexDocumentSummary } from "./types";

export function StudioDocumentList() {
  const [documents, setDocuments] = useState<TexDocumentSummary[] | null>(null);
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<TexDocumentKind | null>(null);

  /**
   * Preferences start at their defaults and are hydrated in an effect rather than read
   * during the initial render. Reading localStorage while rendering makes the server's
   * HTML and the client's first paint disagree, which React reports as a hydration error.
   */
  const [view, setView] = useState<StudioView>("list");
  const [sort, setSort] = useState<StudioSort>("recent");
  const [defaults, setDefaults] = useState<StudioDocumentDefaults>(
    DEFAULT_DOCUMENT_DEFAULTS,
  );
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [newOpen, setNewOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(
    null,
  );
  const [importing, setImporting] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fileInput = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const showErrorToast = useErrorToast();
  const { addToast } = useToast();
  const { confirm, dialog } = useConfirmDialog();

  useEffect(() => {
    setView(readStudioView());
    setSort(readStudioSort());
    setDefaults(readStudioDefaults());
  }, []);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/tex-documents");
      const body = await readJsonResponse<{ documents: TexDocumentSummary[] }>(
        response,
        "Could not load your documents",
      );
      setDocuments(body.documents ?? []);
    } catch (error) {
      setDocuments([]);
      showErrorToast(error, { title: "Could not load your documents" });
    }
  }, [showErrorToast]);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(
    () =>
      filterAndSortDocuments(documents ?? [], {
        query,
        kind: kindFilter,
        sort,
      }),
    [documents, query, kindFilter, sort],
  );
  const counts = useMemo(() => countByKind(documents ?? []), [documents]);

  const chooseView = (next: StudioView) => {
    setView(next);
    writeStudioView(next);
  };
  const chooseSort = (next: StudioSort) => {
    setSort(next);
    writeStudioSort(next);
  };
  const chooseDefaults = (next: StudioDocumentDefaults) => {
    setDefaults(next);
    writeStudioDefaults(next);
  };

  const create = async ({
    kind,
    source,
    title,
  }: {
    kind: TexDocumentKind;
    source: NewDocumentSource;
    title: string;
  }) => {
    setCreating(true);
    try {
      const endpoint =
        source === "bank"
          ? "/api/tex-documents/from-bank"
          : "/api/tex-documents/starter";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          ...(title ? { title } : {}),
          settings: defaults,
        }),
      });
      const body = await readJsonResponse<{ document: { id: string } }>(
        response,
        "Could not create a document",
      );
      setNewOpen(false);
      router.push(`/studio/tex/${body.document.id}`);
    } catch (error) {
      showErrorToast(error, {
        title: "Could not create a document",
        fallbackDescription:
          source === "bank"
            ? "Your knowledge bank may be empty — try starting from a blank starter instead."
            : undefined,
      });
    } finally {
      setCreating(false);
    }
  };

  /**
   * The file is read in the browser first so the kind can be guessed and confirmed BEFORE
   * anything is created. Uploading first and asking afterwards would leave a mislabelled
   * document behind whenever the user backed out.
   */
  const stageImport = async (file: File) => {
    try {
      const source = await file.text();
      const guess = detectDocumentKind(source, file.name);
      setPendingImport({
        file,
        source,
        guess,
        kind: guess.kind,
        title: titleFromFile(file.name),
      });
    } catch (error) {
      showErrorToast(error, { title: "Could not read that file" });
    }
  };

  const confirmImport = async () => {
    if (!pendingImport) return;
    setImporting(true);
    try {
      const form = new FormData();
      form.append("file", pendingImport.file);
      form.append("kind", pendingImport.kind);
      if (pendingImport.title.trim()) {
        form.append("title", pendingImport.title.trim());
      }
      const response = await fetch("/api/tex-documents/import", {
        method: "POST",
        body: form,
      });
      const body = await readJsonResponse<{
        document: { id: string };
        annotated: boolean;
      }>(response, "Could not add that file");

      if (!body.annotated) {
        addToast({
          type: "info",
          title: "Added",
          description:
            "It renders exactly as written. Use “Find structure with AI” to make it editable.",
        });
      }
      setPendingImport(null);
      router.push(`/studio/tex/${body.document.id}`);
    } catch (error) {
      showErrorToast(error, { title: "Could not add that file" });
    } finally {
      setImporting(false);
    }
  };

  const rename = async (document: TexDocumentSummary, title: string) => {
    setRenamingId(null);
    const next = title.trim();
    if (!next || next === document.title) return;

    // Optimistic: renaming is cheap, reversible, and the list feels broken if the name
    // does not change until a round trip completes.
    setDocuments((current) =>
      (current ?? []).map((entry) =>
        entry.id === document.id ? { ...entry, title: next } : entry,
      ),
    );
    try {
      const response = await fetch(`/api/tex-documents/${document.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: next }),
      });
      await readJsonResponse(response, "Could not rename that document");
    } catch (error) {
      setDocuments((current) =>
        (current ?? []).map((entry) =>
          entry.id === document.id
            ? { ...entry, title: document.title }
            : entry,
        ),
      );
      showErrorToast(error, { title: "Could not rename that document" });
    }
  };

  const duplicate = async (document: TexDocumentSummary) => {
    setBusyId(document.id);
    try {
      const response = await fetch(
        `/api/tex-documents/${document.id}/duplicate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        },
      );
      const body = await readJsonResponse<{ document: TexDocumentSummary }>(
        response,
        "Could not duplicate that document",
      );
      setDocuments((current) => [body.document, ...(current ?? [])]);
      addToast({
        type: "success",
        title: `Copied to “${body.document.title}”`,
      });
    } catch (error) {
      showErrorToast(error, { title: "Could not duplicate that document" });
    } finally {
      setBusyId(null);
    }
  };

  /**
   * Pattern A per docs/destructive-actions-pattern.md: a document and its whole version
   * history go, and nothing brings them back.
   */
  const remove = async (document: TexDocumentSummary) => {
    const confirmed = await confirm({
      title: `Delete “${document.title}”?`,
      description:
        "This deletes the document and its version history. It cannot be undone.",
      confirmLabel: "Delete",
      confirmVariant: "destructive",
    });
    if (!confirmed) return;

    setBusyId(document.id);
    try {
      const response = await fetch(`/api/tex-documents/${document.id}`, {
        method: "DELETE",
      });
      await readJsonResponse(response, "Could not delete that document");
      setDocuments((current) =>
        (current ?? []).filter((entry) => entry.id !== document.id),
      );
      addToast({ type: "success", title: "Document deleted" });
    } catch (error) {
      showErrorToast(error, { title: "Could not delete that document" });
    } finally {
      setBusyId(null);
    }
  };

  const rowProps = (document: TexDocumentSummary) => ({
    document,
    busy: busyId === document.id,
    renaming: renamingId === document.id,
    onStartRename: () => setRenamingId(document.id),
    onSubmitRename: (title: string) => void rename(document, title),
    onCancelRename: () => setRenamingId(null),
    onDuplicate: () => void duplicate(document),
    onDelete: () => void remove(document),
  });

  const hasAny = (documents?.length ?? 0) > 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={() => setNewOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New document
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={importing}
          onClick={() => fileInput.current?.click()}
        >
          {importing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Upload your own
        </Button>
        <p className="text-[12px] text-ink-3">
          Already have a LaTeX resume? Bring the <code>.tex</code> file.
        </p>
        <input
          ref={fileInput}
          type="file"
          accept=".tex,text/x-tex"
          className="hidden"
          aria-label="Choose a .tex file to upload"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void stageImport(file);
          }}
        />
      </div>

      {hasAny ? (
        <StudioToolbar
          query={query}
          onQueryChange={setQuery}
          kind={kindFilter}
          onKindChange={setKindFilter}
          counts={counts}
          total={documents?.length ?? 0}
          sort={sort}
          onSortChange={chooseSort}
          view={view}
          onViewChange={chooseView}
          settingsOpen={settingsOpen}
          onToggleSettings={() => setSettingsOpen((open) => !open)}
        />
      ) : null}

      {settingsOpen ? (
        <StudioDefaultsPanel defaults={defaults} onChange={chooseDefaults} />
      ) : null}

      {documents === null ? (
        <div className="space-y-2" aria-busy>
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="h-14 animate-pulse rounded-md bg-page-2"
            />
          ))}
        </div>
      ) : !hasAny ? (
        <StandardEmptyState
          icon={FileText}
          title="No documents yet"
          description="Build one from your knowledge bank, start from a blank page, or upload a LaTeX file you already have — it will render exactly as it does today."
        />
      ) : visible.length === 0 ? (
        <StandardEmptyState
          icon={FileText}
          title="Nothing matches"
          description="No document matches that search or filter."
        />
      ) : (
        <>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
            {visible.length === documents.length
              ? pluralize(visible.length, "document")
              : `${visible.length} of ${pluralize(documents.length, "document")}`}
          </p>

          {view === "grid" ? (
            <ul
              // One column until sm: at 390px a two-column grid leaves ~74px for the
              // title once the three action buttons are placed, which truncated every
              // name to "Rena…" — the exact problem the grid exists to solve.
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {visible.map((document) => (
                <li key={document.id}>
                  <DocumentCard {...rowProps(document)} />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-2">
              {visible.map((document) => (
                <li key={document.id}>
                  <DocumentRow {...rowProps(document)} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <NewDocumentDialog
        open={newOpen}
        busy={creating}
        onOpenChange={setNewOpen}
        onCreate={(input) => void create(input)}
      />
      <ImportDialog
        pending={pendingImport}
        busy={importing}
        onChange={setPendingImport}
        onCancel={() => setPendingImport(null)}
        onConfirm={() => void confirmImport()}
      />
      {dialog}
    </div>
  );
}

/** Mirrors the server's fallback so the pre-filled name matches what would be saved. */
function titleFromFile(filename: string): string {
  const base = filename
    .replace(/\.tex$/i, "")
    .replace(/[_-]+/g, " ")
    .trim();
  if (!base) return "Imported resume";
  return base.charAt(0).toUpperCase() + base.slice(1);
}
