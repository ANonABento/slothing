import { AppPage, PageContent } from "@/components/ui/page-layout";
import {
  Skeleton,
  SkeletonButton,
  SkeletonCard,
  SkeletonHeader,
} from "@/components/ui/skeleton";

export function OpportunityDetailSkeleton() {
  return (
    <AppPage>
      <SkeletonHeader />
      <PageContent className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-72 max-w-full" />
            <Skeleton className="h-4 w-48" />
          </div>
          <SkeletonButton className="w-28 rounded-full" />
        </div>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonCard key={index} className="min-h-40" />
            ))}
          </div>
          <SkeletonCard className="min-h-80 lg:sticky lg:top-6" />
        </div>
      </PageContent>
    </AppPage>
  );
}
