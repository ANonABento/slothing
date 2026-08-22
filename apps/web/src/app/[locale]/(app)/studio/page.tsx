import { FileText } from "lucide-react";

import { StudioDocumentList } from "@/components/studio-list/studio-document-list";
import { AppPage, PageContent, PageHeader } from "@/components/ui/page-layout";
import { getLocalizedPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { locale: string } }) {
  return getLocalizedPageMetadata("studio", params.locale);
}

/**
 * Studio — the way in to the LaTeX document editor.
 *
 * This used to be the TipTap editor. The rebuild replaced it: documents are .tex files
 * now, so Studio lists them and the editor lives at /studio/tex/[id].
 */
export default function StudioPage() {
  return (
    <AppPage>
      <PageHeader
        icon={FileText}
        title="Studio"
        description="Your resumes, CVs, and cover letters."
        variant="compact"
      />
      <PageContent>
        <StudioDocumentList />
      </PageContent>
    </AppPage>
  );
}
