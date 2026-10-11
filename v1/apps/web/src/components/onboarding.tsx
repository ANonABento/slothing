"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { STORAGE_KEYS } from "@/lib/constants";
import {
  BuilderStep,
  WelcomeStep,
  UploadStep,
  ReviewStep,
  ConfigureStep,
  DoneStep,
  type OnboardingPath,
} from "@/components/onboarding/steps";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

export const ONBOARDING_STEP_COUNT = 5;

type StepId =
  | "welcome"
  | "upload"
  | "review"
  | "builder"
  | "configure"
  | "done";

interface OnboardingStep {
  id: StepId;
  title: string;
}

const RESUME_PATH_STEPS: OnboardingStep[] = [
  { id: "welcome", title: "Welcome to Slothing" },
  { id: "upload", title: "Upload Your Resume" },
  { id: "review", title: "Review Your Profile" },
  { id: "configure", title: "Configure AI" },
  { id: "done", title: "All Set" },
];

const SCRATCH_PATH_STEPS: OnboardingStep[] = [
  { id: "welcome", title: "Welcome to Slothing" },
  { id: "builder", title: "Build Your Starter Profile" },
  { id: "configure", title: "Configure AI" },
  { id: "done", title: "All Set" },
];

function getActiveSteps(path: OnboardingPath | null): OnboardingStep[] {
  return path === "scratch" ? SCRATCH_PATH_STEPS : RESUME_PATH_STEPS;
}

function readOnboardingCompleted(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
  } catch {
    return "true";
  }
}

function writeOnboardingCompleted(value: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, value);
  } catch {
    // Ignore storage failures and keep the dialog closed for this session.
  }
}

function clearOnboardingCompleted(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
  } catch {
    // Ignore storage failures.
  }
}

function shouldAutoOpenOnboarding(): boolean {
  try {
    const completed = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return completed === null || completed === "show-onboarding";
  } catch {
    return false;
  }
}

function StepContent({
  step,
  onSelectPath,
  onAdvance,
}: {
  step: OnboardingStep;
  onSelectPath: (path: OnboardingPath) => void;
  onAdvance: () => void;
}) {
  switch (step.id) {
    case "welcome":
      return <WelcomeStep onSelectPath={onSelectPath} />;
    case "upload":
      return <UploadStep />;
    case "review":
      return <ReviewStep />;
    case "builder":
      return <BuilderStep onAdvance={onAdvance} />;
    case "configure":
      return <ConfigureStep />;
    case "done":
      return <DoneStep />;
    default:
      return null;
  }
}

export function ProgressDots({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  const a11yT = useA11yTranslations();

  return (
    <div
      className="flex items-center justify-center gap-1.5"
      role="group"
      aria-label={a11yT("onboardingProgress")}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i === current
              ? "w-6 bg-primary"
              : i < current
                ? "w-1.5 bg-primary/50"
                : "w-1.5 bg-muted"
          }`}
          aria-label={
            i === current
              ? `Step ${i + 1} of ${total}, current`
              : i < current
                ? `Step ${i + 1} of ${total}, completed`
                : `Step ${i + 1} of ${total}`
          }
        />
      ))}
    </div>
  );
}
export function OnboardingDialog() {
  const a11yT = useA11yTranslations();

  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [path, setPath] = useState<OnboardingPath | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (pathname !== "/dashboard") return;

    if (shouldAutoOpenOnboarding()) {
      const timer = setTimeout(() => setOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const markComplete = useCallback(() => {
    writeOnboardingCompleted("true");
    setOpen(false);
  }, []);

  const activeSteps = getActiveSteps(path);
  const activeStep = activeSteps[currentStep] ?? activeSteps[0];
  const isLastStep = currentStep === activeSteps.length - 1;
  const hidePrimaryAction =
    activeStep.id === "welcome" || activeStep.id === "builder";

  const handleNext = useCallback(() => {
    if (currentStep < activeSteps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      markComplete();
      router.push("/studio");
    }
  }, [activeSteps.length, currentStep, markComplete, router]);

  const handleSelectPath = useCallback((selectedPath: OnboardingPath) => {
    setPath(selectedPath);
    setCurrentStep(1);
  }, []);

  if (!mounted) return null;

  const onboardingCompleted = readOnboardingCompleted();
  const showLauncher =
    pathname === "/dashboard" &&
    !open &&
    onboardingCompleted !== null &&
    onboardingCompleted !== "true" &&
    onboardingCompleted !== "show-onboarding";

  return (
    <>
      {showLauncher && (
        <Button
          type="button"
          variant="outline"
          className="fixed bottom-4 right-4 z-40 shadow-[var(--shadow-elevated)]"
          onClick={() => setOpen(true)}
        >
          Setup guide
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          {/* Accessible but hidden title/description for the dialog */}
          <DialogTitle className="sr-only">{activeStep.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Onboarding step {currentStep + 1} of {activeSteps.length}
          </DialogDescription>

          {/* Skip button */}
          <button
            onClick={markComplete}
            className="absolute right-4 top-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label={a11yT("skipOnboarding")}
          >
            <X className="h-4 w-4" />
          </button>

          {/* Progress dots */}
          <div className="mb-6">
            <ProgressDots total={activeSteps.length} current={currentStep} />
          </div>

          {/* Step content */}
          <StepContent
            step={activeStep}
            onSelectPath={handleSelectPath}
            onAdvance={handleNext}
          />

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-6">
            {!hidePrimaryAction && (
              <Button
                onClick={handleNext}
                className="gradient-bg text-primary-foreground hover:opacity-90"
              >
                {isLastStep ? "Get Started" : "Continue"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {!isLastStep && (
              <Button variant="ghost" onClick={markComplete}>
                Skip setup
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Hook to reset onboarding (useful for testing)
export function useOnboarding() {
  const reset = () => {
    writeOnboardingCompleted("show-onboarding");
    window.location.reload();
  };

  const isCompleted = () => {
    if (typeof window === "undefined") return true;
    return !!readOnboardingCompleted();
  };

  return { reset, isCompleted };
}
