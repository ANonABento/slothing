"use client";

/**
 * The Studio document list.
 *
 * `/studio` used to be the TipTap editor. It is now the way in to the LaTeX editor:
 * create a résumé from your bank, import a .tex you already have, or open something you
 * were working on.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { FileText, Loader2, Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StandardEmptyState } from "@/components/ui/page-layout";
import { useErrorToast } from "@/hooks/use-error-toast";
import { useToast } from "@/components/ui/toast";
import { readJsonResponse } from "@/lib/http";
import { Link, useRouter } from "@/i18n/navigation";
import { pluralize } from "@/lib/text/pluralize";
import { TimeAgo } from "@/components/format/time-ago";

interface TexDocumentSummary {
  id: string;
  title: string;
  kind: "resume" | "cv" | "cover_letter";
  updatedAt: string;
}

const KIND_LABEL: Record<TexDocumentSummary["kind"], string> = {
  resume: "Résumé",
  cv: "CV",
  cover_letter: "Cover letter",
};

export function StudioDocumentList() {
  const [documents, setDocuments] = useState<TexDocumentSummary[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const showErrorToast = useErrorToast();
  const { addToast } = useToast();

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

  const createFromBank = async () => {
    setCreating(true);
    try {
      const response = await fetch("/api/tex-documents/from-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const body = await readJsonResponse<{ document: { id: string } }>(
        response,
        "Could not create a document",
      );
      router.push(`/studio/tex/${body.document.id}`);
    } catch (error) {
      showErrorToast(error, {
        title: "Could not create a document",
        fallbackDescription:
          "Upload a résumé to your knowledge bank first, then try again.",
      });
    } finally {
      setCreating(false);
    }
  };

  const importTex = async (file: File) => {
    setImporting(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/tex-documents/import", {
        method: "POST",
        body: form,
      });
      const body = await readJsonResponse<{
        document: { id: string };
        annotated: boolean;
      }>(response, "Could not import that file");

      if (!body.annotated) {
        addToast({
          type: "info",
          title: "Imported",
          description:
            "It renders exactly as written. Use “Find structure with AI” to make it editable.",
        });
      }
      router.push(`/studio/tex/${body.document.id}`);
    } catch (error) {
      showErrorToast(error, { title: "Could not import that file" });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={() => void createFromBank()}
          disabled={creating}
        >
          {creating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          New résumé from my bank
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
          Import a .tex file
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept=".tex"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void importTex(file);
          }}
        />
      </div>

      {documents === null ? (
        <div className="space-y-2" aria-busy>
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="h-14 animate-pulse rounded-md bg-page-2"
            />
          ))}
        </div>
      ) : documents.length === 0 ? (
        <StandardEmptyState
          icon={FileText}
          title="No documents yet"
          description="Build one from your knowledge bank, or bring a .tex you already have — it will render exactly as it does today."
        />
      ) : (
        <>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
            {pluralize(documents.length, "document")}
          </p>
          <ul className="space-y-2">
            {documents.map((document) => (
              <li key={document.id}>
                <Link
                  href={`/studio/tex/${document.id}`}
                  className="flex items-center gap-3 rounded-md border border-rule bg-paper p-4 transition-all hover:-translate-y-px hover:border-brand hover:shadow-paper-card"
                >
                  <FileText className="h-4 w-4 shrink-0 text-ink-3" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold text-ink">
                      {document.title}
                    </span>
                    <span className="block text-[12px] text-ink-3">
                      {KIND_LABEL[document.kind]} · edited{" "}
                      <TimeAgo date={document.updatedAt} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
