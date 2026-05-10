import { AppPage, PageContent } from "@/components/ui/page-layout";
import {
  SkeletonButton,
  SkeletonCard,
  SkeletonFormSection,
  SkeletonHeader,
} from "@/components/ui/skeleton";

export function SalarySkeleton() {
  return (
    <AppPage>
      <SkeletonHeader />
      <PageContent className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonButton key={index} className="h-10 w-32" />
          ))}
        </div>
        <SkeletonFormSection rows={6} />
        <div className="grid gap-4 lg:grid-cols-2">
          <SkeletonCard className="min-h-48" />
          <SkeletonCard className="min-h-48" />
        </div>
      </PageContent>
    </AppPage>
  );
}
