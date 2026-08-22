import { notFound } from "next/navigation";

import { TexEditor } from "@/components/tex-editor/tex-editor";
import { AppPage } from "@/components/ui/page-layout";
import { isAuthError, requireAuth } from "@/lib/auth";
import { getTexDocument } from "@/lib/db/tex-documents";

export const dynamic = "force-dynamic";

/**
 * The LaTeX document editor.
 *
 * Reached from the Studio list rather than the sidebar: `/studio` lists documents and
 * this route edits one of them, so there is exactly one entry point.
 *
 * A server component so the first paint already holds the source and can compile
 * immediately, with no client round trip on mount.
 */
export default async function TexEditorPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const auth = await requireAuth();
  if (isAuthError(auth)) notFound();

  const document = await getTexDocument(params.id, auth.userId);
  if (!document) notFound();

  return (
    <AppPage padding="none">
      {/*
        Matched to the app shell, not to the viewport. Below lg the shell reserves 4rem of
        padding above `main`; at lg it is a 3.5rem sticky bar instead. `h-screen` here
        overflowed by exactly that bar's height, which pushed the inspector's Download
        button off the bottom of the window.
      */}
      <div className="h-[calc(100vh-4rem)] min-h-0 lg:h-[calc(100vh-3.5rem)]">
        <TexEditor
          document={{
            id: document.id,
            title: document.title,
            kind: document.kind,
            source: document.source,
            updatedAt: document.updatedAt,
          }}
        />
      </div>
    </AppPage>
  );
}
