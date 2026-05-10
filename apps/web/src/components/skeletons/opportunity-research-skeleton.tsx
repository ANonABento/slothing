import { AppPage, PageContent } from "@/components/ui/page-layout";
import { SkeletonChart, SkeletonHeader } from "@/components/ui/skeleton";

export function OpportunityResearchSkeleton() {
  return (
    <AppPage>
      <SkeletonHeader />
      <PageContent className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonChart key={index} />
          ))}
        </div>
      </PageContent>
    </AppPage>
  );
}
