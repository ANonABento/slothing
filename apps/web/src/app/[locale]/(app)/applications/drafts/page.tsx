import { FileCheck2 } from "lucide-react";
import { AppPage, PageContent, PageHeader } from "@/components/ui/page-layout";
import { DraftReviewList } from "@/components/applications/draft-review-list";

export default function DraftReviewPage() {
  return (
    <AppPage>
      <PageHeader
        icon={FileCheck2}
        title="Review drafts"
        description="Applications your agent drafted overnight. Approve, edit, or reject — nothing is submitted until you say so."
      />
      <PageContent>
        <DraftReviewList />
      </PageContent>
    </AppPage>
  );
}
