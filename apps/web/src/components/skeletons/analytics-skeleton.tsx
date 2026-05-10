import {
  AppPage,
  PageContent,
  pageGridClasses,
} from "@/components/ui/page-layout";
import {
  SkeletonCard,
  SkeletonChart,
  SkeletonHeader,
  SkeletonInsights,
  SkeletonStatCard,
} from "@/components/ui/skeleton";

export function AnalyticsSkeleton() {
  return (
    <AppPage>
      <SkeletonHeader />
      <PageContent className="space-y-5">
        <div className={pageGridClasses.fourStats}>
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonStatCard key={index} />
          ))}
        </div>
        <SkeletonCard className="min-h-48" />
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonChart key={index} />
          ))}
        </div>
        <SkeletonInsights />
      </PageContent>
    </AppPage>
  );
}
