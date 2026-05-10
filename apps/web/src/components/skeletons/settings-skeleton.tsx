import { AppPage, PageContent } from "@/components/ui/page-layout";
import {
  SkeletonButton,
  SkeletonCard,
  SkeletonFormSection,
  SkeletonHeader,
} from "@/components/ui/skeleton";

export function SettingsSkeleton() {
  return (
    <AppPage>
      <SkeletonHeader />
      <PageContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} className="min-h-32" />
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <SkeletonFormSection rows={4} />
          <SkeletonFormSection rows={4} />
        </div>
        <SkeletonCard className="min-h-40">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonButton key={index} className="h-9 w-28" />
            ))}
          </div>
        </SkeletonCard>
      </PageContent>
    </AppPage>
  );
}
