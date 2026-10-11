"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StandardEmptyState } from "@/components/ui/page-layout";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

export function JobsNoResults({
  onClearFilters,
}: {
  onClearFilters: () => void;
}) {
  const a11yT = useA11yTranslations();

  return (
    <StandardEmptyState
      icon={Search}
      title={a11yT("noOpportunitiesMatchYourFilters")}
      description="Try adjusting your search or filters to find what you're looking for."
      action={
        <Button variant="outline" onClick={onClearFilters}>
          Clear All Filters
        </Button>
      }
    />
  );
}
