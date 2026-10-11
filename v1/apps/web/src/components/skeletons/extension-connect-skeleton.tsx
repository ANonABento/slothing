import { CenteredPagePanel } from "@/components/ui/page-layout";
import { Skeleton, SkeletonButton } from "@/components/ui/skeleton";

export function ExtensionConnectSkeleton() {
  return (
    <CenteredPagePanel>
      <div className="text-center">
        <Skeleton className="mx-auto mb-4 h-14 w-14 rounded-full" />
        <Skeleton className="mx-auto h-7 w-56" />
        <Skeleton className="mx-auto mt-3 h-4 w-72 max-w-full" />
        <SkeletonButton className="mx-auto mt-6 h-10 w-36" />
      </div>
    </CenteredPagePanel>
  );
}
