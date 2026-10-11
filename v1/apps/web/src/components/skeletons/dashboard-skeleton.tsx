import { PageShell, pageGridClasses } from "@/components/ui/page-layout";
import {
  Skeleton,
  SkeletonButton,
  SkeletonCard,
  SkeletonJobCard,
  SkeletonStatCard,
} from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          <SkeletonButton className="h-10 w-32" />
          <SkeletonButton className="h-10 w-36" />
        </div>
      </div>
      <div className={pageGridClasses.fourStats}>
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonStatCard key={index} />
        ))}
      </div>
      <div className={pageGridClasses.primaryAside}>
        <SkeletonCard className="min-h-72" />
        <SkeletonCard className="min-h-72" />
      </div>
      <SkeletonCard className="min-h-32" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonJobCard key={index} />
        ))}
      </div>
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <PageShell>
      <DashboardSkeleton />
    </PageShell>
  );
}
