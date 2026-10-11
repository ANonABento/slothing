import { AppPage, PageContent } from "@/components/ui/page-layout";
import {
  Skeleton,
  SkeletonCard,
  SkeletonHeader,
} from "@/components/ui/skeleton";

export function CalendarSkeleton() {
  return (
    <AppPage>
      <SkeletonHeader />
      <PageContent>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-9 w-28" />
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="aspect-square min-h-16 w-full"
                />
              ))}
            </div>
          </div>
          <SkeletonCard className="min-h-96" />
        </div>
      </PageContent>
    </AppPage>
  );
}
