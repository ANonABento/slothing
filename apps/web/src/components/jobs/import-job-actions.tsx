"use client";

import type { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { THEME_PRIMARY_GRADIENT_BUTTON_CLASSES } from "@/lib/theme/component-classes";

interface ImportJobActionsProps {
  disabled: boolean;
  loading: boolean;
  icon: LucideIcon;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: () => void;
}

export function ImportJobActions({
  disabled,
  loading,
  icon: Icon,
  submitLabel,
  onCancel,
  onSubmit,
}: ImportJobActionsProps) {
  const commonT = useTranslations("common");

  return (
    <div className="flex justify-end gap-3 pt-2">
      <Button variant="outline" onClick={onCancel}>
        {commonT("cancel")}
      </Button>
      <Button
        onClick={onSubmit}
        disabled={disabled}
        className={THEME_PRIMARY_GRADIENT_BUTTON_CLASSES}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Icon className="h-4 w-4 mr-2" />
        )}
        {submitLabel}
      </Button>
    </div>
  );
}
