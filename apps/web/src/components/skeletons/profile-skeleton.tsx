import { AppPage, PageContent } from "@/components/ui/page-layout";
import {
  Skeleton,
  SkeletonButton,
  SkeletonFormSection,
  SkeletonHeader,
} from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <AppPage>
      <SkeletonHeader />
      <PageContent>
        <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-lg border bg-card p-6 shadow-sm">
            <Skeleton className="mx-auto h-24 w-24 rounded-full" />
            <div className="mt-5 space-y-2">
              <Skeleton className="mx-auto h-6 w-40" />
              <Skeleton className="mx-auto h-4 w-28" />
            </div>
            <div className="mt-6 space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonButton key={index} className="h-10 w-full" />
              ))}
            </div>
          </aside>
          <div className="space-y-5">
            <SkeletonFormSection rows={4} />
            <SkeletonFormSection rows={6} />
          </div>
        </div>
      </PageContent>
    </AppPage>
  );
}
