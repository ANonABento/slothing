"use client";

import { type ChangeEvent, type FormEvent, useMemo, useState } from "react";
import {
  AlertCircle,
  BriefcaseBusiness,
  GraduationCap,
  Loader2,
  Sparkles,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  scratchProfileFromAnswers,
  type ScratchProfileAnswers,
} from "@/lib/onboarding/scratch-profile";

const initialAnswers: ScratchProfileAnswers = {
  name: "",
  email: "",
  headline: "",
  summary: "",
  educationInstitution: "",
  educationDegree: "",
  educationField: "",
  skillsCsv: "",
  experienceCompany: "",
  experienceTitle: "",
  experienceHighlights: "",
  projectName: "",
  projectSummary: "",
  projectHighlights: "",
  achievements: "",
};

interface BuilderStepProps {
  onAdvance: () => void;
}

export function BuilderStep({ onAdvance }: BuilderStepProps) {
  const t = useTranslations("onboarding.steps.builder");
  const [answers, setAnswers] = useState<ScratchProfileAnswers>(initialAnswers);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const canSubmit = useMemo(
    () =>
      answers.name.trim().length > 0 &&
      answers.email.trim().length > 0 &&
      answers.headline.trim().length > 0 &&
      !submitting,
    [answers.email, answers.headline, answers.name, submitting],
  );

  const updateAnswer =
    (field: keyof ScratchProfileAnswers) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setAnswers((current) => ({ ...current, [field]: event.target.value }));
      setError(null);
    };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/onboarding/seed-profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(scratchProfileFromAnswers(answers)),
      });

      if (!response.ok) {
        throw new Error(t("errors.save"));
      }

      onAdvance();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : t("errors.save"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg mb-6">
          <Sparkles className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-semibold">{t("title")}</h2>
        <p className="text-base mt-2 text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <form className="mt-6 space-y-4 text-left" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-primary" />
              {t("fields.name")}
            </span>
            <Input
              value={answers.name}
              onChange={updateAnswer("name")}
              autoComplete="name"
              required
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium">{t("fields.email")}</span>
            <Input
              type="email"
              value={answers.email}
              onChange={updateAnswer("email")}
              autoComplete="email"
              required
            />
          </label>
        </div>

        <label className="space-y-1.5 block">
          <span className="flex items-center gap-2 text-sm font-medium">
            <BriefcaseBusiness className="h-4 w-4 text-primary" />
            {t("fields.targetRole")}
          </span>
          <Input
            value={answers.headline}
            onChange={updateAnswer("headline")}
            placeholder={t("placeholders.targetRole")}
            required
          />
        </label>

        <label className="space-y-1.5 block">
          <span className="text-sm font-medium">
            {t("fields.backgroundSummary")}
          </span>
          <Textarea
            value={answers.summary}
            onChange={updateAnswer("summary")}
            placeholder={t("placeholders.backgroundSummary")}
          />
        </label>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <GraduationCap className="h-4 w-4 text-primary" />
            {t("fields.education")}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              aria-label={t("fields.school")}
              value={answers.educationInstitution}
              onChange={updateAnswer("educationInstitution")}
              placeholder={t("fields.school")}
            />
            <Input
              aria-label={t("fields.degree")}
              value={answers.educationDegree}
              onChange={updateAnswer("educationDegree")}
              placeholder={t("fields.degree")}
            />
            <Input
              aria-label={t("fields.field")}
              value={answers.educationField}
              onChange={updateAnswer("educationField")}
              placeholder={t("fields.field")}
            />
          </div>
        </div>

        <label className="space-y-1.5 block">
          <span className="text-sm font-medium">{t("fields.topSkills")}</span>
          <Input
            value={answers.skillsCsv}
            onChange={updateAnswer("skillsCsv")}
            placeholder={t("placeholders.topSkills")}
          />
        </label>

        <div className="rounded-[var(--radius)] border-[length:var(--border-width)] border-border/70">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-muted-foreground"
            aria-expanded={expanded}
            onClick={() => setExpanded((current) => !current)}
          >
            <span className="font-medium text-foreground">
              {t("optional.title")}
            </span>
            <span aria-hidden="true">
              {expanded ? t("optional.hide") : t("optional.add")}
            </span>
          </button>

          {expanded && (
            <div className="space-y-4 border-t border-border/70 px-4 py-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">
                    {t("fields.company")}
                  </span>
                  <Input
                    value={answers.experienceCompany}
                    onChange={updateAnswer("experienceCompany")}
                    placeholder={t("placeholders.company")}
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">
                    {t("fields.roleTitle")}
                  </span>
                  <Input
                    value={answers.experienceTitle}
                    onChange={updateAnswer("experienceTitle")}
                    placeholder={t("placeholders.roleTitle")}
                  />
                </label>
              </div>

              <label className="space-y-1.5 block">
                <span className="text-sm font-medium">
                  {t("fields.roleHighlights")}
                </span>
                <Textarea
                  value={answers.experienceHighlights}
                  onChange={updateAnswer("experienceHighlights")}
                  placeholder={t("placeholders.roleHighlights")}
                />
              </label>

              <label className="space-y-1.5 block">
                <span className="text-sm font-medium">
                  {t("fields.projectName")}
                </span>
                <Input
                  value={answers.projectName}
                  onChange={updateAnswer("projectName")}
                  placeholder={t("placeholders.projectName")}
                />
              </label>

              <label className="space-y-1.5 block">
                <span className="text-sm font-medium">
                  {t("fields.projectSummary")}
                </span>
                <Textarea
                  value={answers.projectSummary}
                  onChange={updateAnswer("projectSummary")}
                  placeholder={t("placeholders.projectSummary")}
                />
              </label>

              <label className="space-y-1.5 block">
                <span className="text-sm font-medium">
                  {t("fields.projectHighlights")}
                </span>
                <Textarea
                  value={answers.projectHighlights}
                  onChange={updateAnswer("projectHighlights")}
                  placeholder={t("placeholders.projectHighlights")}
                />
              </label>

              <label className="space-y-1.5 block">
                <span className="text-sm font-medium">
                  {t("fields.achievements")}
                </span>
                <Input
                  value={answers.achievements}
                  onChange={updateAnswer("achievements")}
                  placeholder={t("placeholders.achievements")}
                />
              </label>
            </div>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-[var(--radius)] border-[length:var(--border-width)] border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full gradient-bg text-primary-foreground hover:opacity-90"
          disabled={!canSubmit}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t("actions.saving")}
            </>
          ) : (
            t("actions.saveContinue")
          )}
        </Button>
      </form>
    </div>
  );
}
