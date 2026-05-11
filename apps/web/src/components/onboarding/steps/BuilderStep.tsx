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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  scratchProfileFromAnswers,
  type ScratchProfileAnswers,
} from "@/lib/onboarding/scratch-profile";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

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
  const a11yT = useA11yTranslations();

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
        throw new Error("Unable to save your profile starter.");
      }

      onAdvance();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save your profile starter.",
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
        <h2 className="text-2xl font-semibold">Build Your Starter Profile</h2>
        <p className="text-base mt-2 text-muted-foreground">
          Answer a few quick prompts so Slothing can organize your career
          details without a resume upload.
        </p>
      </div>

      <form className="mt-6 space-y-4 text-left" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-primary" />
              Name
            </span>
            <Input
              value={answers.name}
              onChange={updateAnswer("name")}
              autoComplete="name"
              required
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium">Email</span>
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
            Target role
          </span>
          <Input
            value={answers.headline}
            onChange={updateAnswer("headline")}
            placeholder={a11yT("frontendInternProjectManagerDataAnalyst")}
            required
          />
        </label>

        <label className="space-y-1.5 block">
          <span className="text-sm font-medium">Background summary</span>
          <Textarea
            value={answers.summary}
            onChange={updateAnswer("summary")}
            placeholder="A sentence about your background, interests, or next move"
          />
        </label>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <GraduationCap className="h-4 w-4 text-primary" />
            Education
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              aria-label={a11yT("school")}
              value={answers.educationInstitution}
              onChange={updateAnswer("educationInstitution")}
              placeholder={a11yT("school")}
            />
            <Input
              aria-label={a11yT("degree")}
              value={answers.educationDegree}
              onChange={updateAnswer("educationDegree")}
              placeholder={a11yT("degree")}
            />
            <Input
              aria-label={a11yT("field")}
              value={answers.educationField}
              onChange={updateAnswer("educationField")}
              placeholder={a11yT("field")}
            />
          </div>
        </div>

        <label className="space-y-1.5 block">
          <span className="text-sm font-medium">Top skills</span>
          <Input
            value={answers.skillsCsv}
            onChange={updateAnswer("skillsCsv")}
            placeholder={a11yT("customerServiceExcelPython")}
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
              Add a role, project, or honour (optional)
            </span>
            <span aria-hidden="true">{expanded ? "Hide" : "Add"}</span>
          </button>

          {expanded && (
            <div className="space-y-4 border-t border-border/70 px-4 py-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">
                    Company / organisation
                  </span>
                  <Input
                    value={answers.experienceCompany}
                    onChange={updateAnswer("experienceCompany")}
                    placeholder={a11yT("campusCafe")}
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">Role / title</span>
                  <Input
                    value={answers.experienceTitle}
                    onChange={updateAnswer("experienceTitle")}
                    placeholder={a11yT("barista")}
                  />
                </label>
              </div>

              <label className="space-y-1.5 block">
                <span className="text-sm font-medium">
                  Role highlights (one per line, up to 3)
                </span>
                <Textarea
                  value={answers.experienceHighlights}
                  onChange={updateAnswer("experienceHighlights")}
                  placeholder={"Pulled espresso shots\nTrained 3 new baristas"}
                />
              </label>

              <label className="space-y-1.5 block">
                <span className="text-sm font-medium">Project name</span>
                <Input
                  value={answers.projectName}
                  onChange={updateAnswer("projectName")}
                  placeholder={a11yT("communityPantryDashboard")}
                />
              </label>

              <label className="space-y-1.5 block">
                <span className="text-sm font-medium">What did you build?</span>
                <Textarea
                  value={answers.projectSummary}
                  onChange={updateAnswer("projectSummary")}
                  placeholder="A class project that tracked donations and volunteer shifts"
                />
              </label>

              <label className="space-y-1.5 block">
                <span className="text-sm font-medium">
                  Project highlights (one per line)
                </span>
                <Textarea
                  value={answers.projectHighlights}
                  onChange={updateAnswer("projectHighlights")}
                  placeholder={
                    "Built a filterable tracker\nPresented findings to class"
                  }
                />
              </label>

              <label className="space-y-1.5 block">
                <span className="text-sm font-medium">
                  Honours, awards, leadership (comma-separated)
                </span>
                <Input
                  value={answers.achievements}
                  onChange={updateAnswer("achievements")}
                  placeholder={a11yT("residenceCouncilSecretaryDeanSList")}
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
              Saving
            </>
          ) : (
            "Save and continue"
          )}
        </Button>
      </form>
    </div>
  );
}
