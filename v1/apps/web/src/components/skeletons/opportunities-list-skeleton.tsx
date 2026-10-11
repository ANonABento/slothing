import { AppPage, PageContent } from "@/components/ui/page-layout";
import {
  SkeletonButton,
  SkeletonHeader,
  SkeletonJobCard,
} from "@/components/ui/skeleton";

export function OpportunitiesListSkeleton() {
  return (
    <AppPage>
      <SkeletonHeader />
      <PageContent className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonButton key={index} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonJobCard key={index} />
          ))}
        </div>
      </PageContent>
    </AppPage>
  );
}
