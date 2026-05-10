import {
  AppPage,
  PageContent,
  pageGridClasses,
} from "@/components/ui/page-layout";
import {
  SkeletonButton,
  SkeletonCard,
  SkeletonHeader,
  SkeletonStatCard,
} from "@/components/ui/skeleton";

export function AnswerBankSkeleton() {
  return (
    <AppPage>
      <SkeletonHeader />
      <PageContent className="space-y-5">
        <div className={pageGridClasses.fourStats}>
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonStatCard key={index} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonButton key={index} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} className="min-h-48" />
          ))}
        </div>
      </PageContent>
    </AppPage>
  );
}
