import { AppPage, PageContent } from "@/components/ui/page-layout";
import {
  SkeletonButton,
  SkeletonChunkCard,
  SkeletonHeader,
} from "@/components/ui/skeleton";

export function BankSkeleton() {
  return (
    <AppPage>
      <SkeletonHeader />
      <PageContent className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonButton key={index} className="h-9 w-28 rounded-full" />
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonChunkCard key={index} />
          ))}
        </div>
      </PageContent>
    </AppPage>
  );
}
