import { PageWorkspace } from "@/components/ui/page-layout";
import {
  Skeleton,
  SkeletonButton,
  SkeletonCard,
} from "@/components/ui/skeleton";

export function StudioSkeleton() {
  return (
    <PageWorkspace>
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_360px]">
        <aside className="hidden border-r bg-card/70 p-4 lg:block">
          <Skeleton className="mb-5 h-9 w-32" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} className="p-4 shadow-none" />
            ))}
          </div>
        </aside>
        <main className="min-h-0 bg-background p-5">
          <div className="mx-auto h-full max-w-3xl rounded-lg border bg-card p-8 shadow-sm">
            <Skeleton className="mb-6 h-8 w-2/3" />
            <div className="space-y-3">
              {Array.from({ length: 12 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className={index % 4 === 3 ? "h-4 w-3/4" : "h-4 w-full"}
                />
              ))}
            </div>
          </div>
        </main>
        <aside className="hidden border-l bg-card/70 p-4 lg:block">
          <Skeleton className="mb-5 h-9 w-40" />
          <div className="space-y-4">
            <SkeletonCard className="p-4 shadow-none" />
            <Skeleton className="h-28 w-full" />
            <div className="flex gap-2">
              <SkeletonButton className="flex-1" />
              <SkeletonButton className="w-20" />
            </div>
          </div>
        </aside>
      </div>
    </PageWorkspace>
  );
}
