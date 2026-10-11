"use client";

import { FileUp, PencilLine, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export type OnboardingPath = "resume" | "scratch";

interface WelcomeStepProps {
  onSelectPath: (path: OnboardingPath) => void;
}

export function WelcomeStep({ onSelectPath }: WelcomeStepProps) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg mb-6">
        <Rocket className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-semibold">Welcome to Slothing</h2>
      <p className="text-base mt-2 text-muted-foreground">
        Your AI-powered job application assistant. Let&apos;s get your career
        details organized in a few quick steps.
      </p>
      <div className="mt-6 pt-6 border-t space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          Pick the starting point that fits where you are today.
        </p>
        <Button
          type="button"
          className="w-full gap-2 gradient-bg text-primary-foreground hover:opacity-90"
          onClick={() => onSelectPath("resume")}
        >
          <FileUp className="h-4 w-4" />I have a resume
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={() => onSelectPath("scratch")}
        >
          <PencilLine className="h-4 w-4" />
          I&apos;m starting from scratch
        </Button>
      </div>
    </div>
  );
}
