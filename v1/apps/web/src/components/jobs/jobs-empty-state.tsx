"use client";

import { Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StandardEmptyState } from "@/components/ui/page-layout";
import { THEME_PRIMARY_GRADIENT_BUTTON_CLASSES } from "@/lib/theme/component-classes";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

export function JobsEmptyState({ onAdd }: { onAdd: () => void }) {
  const a11yT = useA11yTranslations();

  return (
    <StandardEmptyState
      icon={Briefcase}
      title={a11yT("noOpportunitiesTrackedYet")}
      description="Add an opportunity description to analyze your match score and generate a tailored resume."
      action={
        <Button
          onClick={onAdd}
          size="lg"
          className={THEME_PRIMARY_GRADIENT_BUTTON_CLASSES}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Your First Opportunity
        </Button>
      }
    />
  );
}
