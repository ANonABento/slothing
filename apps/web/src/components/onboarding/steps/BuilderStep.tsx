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

const initialAnswers: ScratchProfileAnswers = {
  name: "",
  email: "",
  headline: "",
  summary: "",
  educationInstitution: "",
  educationDegree: "",
  educationField: "",
  skillsCsv: "",
};

interface BuilderStepProps {
  onAdvance: () => void;
}

export function BuilderStep({ onAdvance }: BuilderStepProps) {
  const [answers, setAnswers] = useState<ScratchProfileAnswers>(initialAnswers);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
            placeholder="Frontend intern, project manager, data analyst"
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
              aria-label="School"
              value={answers.educationInstitution}
              onChange={updateAnswer("educationInstitution")}
              placeholder="School"
            />
            <Input
              aria-label="Degree"
              value={answers.educationDegree}
              onChange={updateAnswer("educationDegree")}
              placeholder="Degree"
            />
            <Input
              aria-label="Field"
              value={answers.educationField}
              onChange={updateAnswer("educationField")}
              placeholder="Field"
            />
          </div>
        </div>

        <label className="space-y-1.5 block">
          <span className="text-sm font-medium">Top skills</span>
          <Input
            value={answers.skillsCsv}
            onChange={updateAnswer("skillsCsv")}
            placeholder="Customer service, Excel, Python"
          />
        </label>

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
