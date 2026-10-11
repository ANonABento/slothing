"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

export interface AppRouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function AppRouteError({ error, reset }: AppRouteErrorProps) {
  const a11yT = useA11yTranslations();

  useEffect(() => {
    console.error("App route render failed:", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-10">
      <ErrorState
        title={a11yT("weCouldnTLoadThisPage")}
        message="Something went wrong while loading this page. Try again to reload it."
        onRetry={reset}
        variant="card"
        className="w-full max-w-xl"
      />
    </div>
  );
}
