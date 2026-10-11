"use client";

import { Check, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { THEME_PRIMARY_GRADIENT_BUTTON_CLASSES } from "@/lib/theme/component-classes";
import type { ParsedJobPreview } from "./import-job-dialog.types";

interface ImportJobEditFormProps {
  preview: ParsedJobPreview;
  saving: boolean;
  onFieldChange: <K extends keyof ParsedJobPreview>(
    field: K,
    value: ParsedJobPreview[K],
  ) => void;
  onBack: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export function ImportJobEditForm({
  preview,
  saving,
  onFieldChange,
  onBack,
  onCancel,
  onSave,
}: ImportJobEditFormProps) {
  const t = useTranslations("jobs.import.editForm");
  const commonT = useTranslations("common");

  return (
    <div className="space-y-4 py-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("fields.jobTitle")}</Label>
          <Input
            value={preview.title}
            onChange={(e) => onFieldChange("title", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>{t("fields.company")}</Label>
          <Input
            value={preview.company}
            onChange={(e) => onFieldChange("company", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("fields.location")}</Label>
          <Input
            value={preview.location}
            onChange={(e) => onFieldChange("location", e.target.value)}
            placeholder={t("placeholders.location")}
          />
        </div>
        <div className="space-y-2">
          <Label>{t("fields.jobType")}</Label>
          <Select
            value={preview.type}
            onValueChange={(value) => onFieldChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("placeholders.selectType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">{t("types.fullTime")}</SelectItem>
              <SelectItem value="part-time">{t("types.partTime")}</SelectItem>
              <SelectItem value="contract">{t("types.contract")}</SelectItem>
              <SelectItem value="internship">
                {t("types.internship")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("fields.salary")}</Label>
          <Input
            value={preview.salary}
            onChange={(e) => onFieldChange("salary", e.target.value)}
            placeholder="$120,000 - $150,000"
          />
        </div>
        <div className="space-y-2">
          <Label>{t("fields.remote")}</Label>
          <Select
            value={preview.remote ? "yes" : "no"}
            onValueChange={(value) => onFieldChange("remote", value === "yes")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">{t("remote.remote")}</SelectItem>
              <SelectItem value="no">{t("remote.onsite")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("fields.url")}</Label>
        <Input
          value={preview.url || ""}
          onChange={(e) => onFieldChange("url", e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="flex justify-between gap-3 pt-2">
        <Button variant="outline" onClick={onBack}>
          {t("actions.backToPreview")}
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            {commonT("cancel")}
          </Button>
          <Button
            onClick={onSave}
            disabled={saving || !preview.title || !preview.company}
            className={THEME_PRIMARY_GRADIENT_BUTTON_CLASSES}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            {t("actions.import")}
          </Button>
        </div>
      </div>
    </div>
  );
}
