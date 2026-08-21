import { notFound } from "next/navigation";

import { TexEditor } from "@/components/tex-editor/tex-editor";
import { AppPage } from "@/components/ui/page-layout";
import { isAuthError, requireAuth } from "@/lib/auth";
import { getTexDocument } from "@/lib/db/tex-documents";

export const dynamic = "force-dynamic";

/**
 * The LaTeX document editor.
 *
 * NOT in the sidebar yet — during the rebuild `/studio` is still the TipTap editor, and
 * shipping two resume editors at once is the confusion this work exists to end. PR 9 adds
 * the nav entry and redirects `/studio` here.
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
      <div className="h-[calc(100vh-4rem)] min-h-0 lg:h-screen">
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
