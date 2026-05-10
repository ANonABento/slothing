import { AppPage, PageContent } from "@/components/ui/page-layout";
import {
  SkeletonButton,
  SkeletonCard,
  SkeletonHeader,
  SkeletonJobCard,
} from "@/components/ui/skeleton";

export function InterviewSkeleton() {
  return (
    <AppPage>
      <SkeletonHeader />
      <PageContent className="space-y-5">
        <SkeletonCard className="min-h-56" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonButton key={index} className="h-10 w-36" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonJobCard key={index} />
          ))}
        </div>
      </PageContent>
    </AppPage>
  );
}
