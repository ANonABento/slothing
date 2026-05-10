import { AppPage, PageContent } from "@/components/ui/page-layout";
import { SkeletonHeader, SkeletonKanbanLane } from "@/components/ui/skeleton";

export function OpportunitiesKanbanSkeleton() {
  return (
    <AppPage>
      <SkeletonHeader />
      <PageContent className="space-y-5">
        <div className="grid gap-3 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonKanbanLane key={index} cards={index === 0 ? 3 : 1} />
          ))}
        </div>
      </PageContent>
    </AppPage>
  );
}
