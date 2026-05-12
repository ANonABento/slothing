"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Timer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  INTERVIEW_DIFFICULTIES,
  INTERVIEW_QUESTION_COUNTS,
  SESSION_QUESTION_CATEGORIES,
  type InterviewDifficulty,
  type SessionQuestionCategory,
} from "@/lib/constants";

interface QuickPracticeDialogProps {
  open: boolean;
  defaultCategory?: SessionQuestionCategory | null;
  defaultQuestionCount: number;
  defaultDifficulty: InterviewDifficulty;
  defaultTimerEnabled: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (options: {
    category: SessionQuestionCategory;
    questionCount: number;
    difficulty: InterviewDifficulty;
    timerEnabled: boolean;
  }) => void;
}

export function QuickPracticeDialog({
  open,
  defaultCategory,
  defaultQuestionCount,
  defaultDifficulty,
  defaultTimerEnabled,
  onOpenChange,
  onSubmit,
}: QuickPracticeDialogProps) {
  const t = useTranslations("interview.quickPractice");
  const commonT = useTranslations("common");
  const [category, setCategory] = useState<SessionQuestionCategory>(
    defaultCategory || "behavioral",
  );
  const [questionCount, setQuestionCount] = useState(defaultQuestionCount);
  const [difficulty, setDifficulty] =
    useState<InterviewDifficulty>(defaultDifficulty);
  const [timerEnabled, setTimerEnabled] = useState(defaultTimerEnabled);

  useEffect(() => {
    if (!open) return;
    setCategory(defaultCategory || "behavioral");
    setQuestionCount(defaultQuestionCount);
    setDifficulty(defaultDifficulty);
    setTimerEnabled(defaultTimerEnabled);
  }, [
    defaultCategory,
    defaultDifficulty,
    defaultQuestionCount,
    defaultTimerEnabled,
    open,
  ]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("title", { category: t(`categories.${category}`) })}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium">
            {t("fields.category")}
            <Select
              value={category}
              onValueChange={(value) =>
                setCategory(value as SessionQuestionCategory)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SESSION_QUESTION_CATEGORIES.filter(
                  (option) => option !== "general",
                ).map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(`categories.${option}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            {t("fields.questions")}
            <Select
              value={String(questionCount)}
              onValueChange={(value) => setQuestionCount(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INTERVIEW_QUESTION_COUNTS.map((count) => (
                  <SelectItem key={count} value={String(count)}>
                    {t("questionCount", { count })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            {t("fields.difficulty")}
            <Select
              value={difficulty}
              onValueChange={(value) =>
                setDifficulty(value as InterviewDifficulty)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INTERVIEW_DIFFICULTIES.map((level) => (
                  <SelectItem key={level} value={level}>
                    {t(`difficulty.${level}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3 text-sm">
            <input
              type="checkbox"
              checked={timerEnabled}
              onChange={(event) => setTimerEnabled(event.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <span className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-primary" />
              {t("timer")}
            </span>
          </label>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            {commonT("cancel")}
          </Button>
          <Button
            type="button"
            className="gradient-bg text-primary-foreground hover:opacity-90"
            onClick={() =>
              onSubmit({ category, questionCount, difficulty, timerEnabled })
            }
          >
            <Zap className="mr-2 h-4 w-4" />
            {t("actions.start")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
