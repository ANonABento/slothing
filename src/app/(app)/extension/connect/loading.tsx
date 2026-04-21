import { Skeleton } from "@/components/ui/skeleton";

export default function ExtensionConnectLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex flex-col items-center space-y-3 pt-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </div>
  );
}
