import { AppPage, PageContent } from "@/components/ui/page-layout";
import { SkeletonCard, SkeletonHeader } from "@/components/ui/skeleton";

export function EmailsSkeleton() {
  return (
    <AppPage>
      <SkeletonHeader />
      <PageContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} className="min-h-52" />
          ))}
        </div>
      </PageContent>
    </AppPage>
  );
}
