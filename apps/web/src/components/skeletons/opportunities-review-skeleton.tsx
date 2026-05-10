import { PageShell } from "@/components/ui/page-layout";
import { SkeletonButton, SkeletonJobCard } from "@/components/ui/skeleton";

export function OpportunitiesReviewSkeleton() {
  return (
    <PageShell>
      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <SkeletonButton className="h-8 w-56" />
            <SkeletonButton className="h-4 w-80 max-w-full" />
          </div>
          <SkeletonButton className="h-10 w-36" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonJobCard key={index} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
