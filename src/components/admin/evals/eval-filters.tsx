"use client";

import { Bot, CalendarDays, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EvalSetOption, ModelKey } from "@/lib/admin/evals/types";
import type { TimeRange } from "@/lib/analytics/time-series";
import { cn } from "@/lib/utils";

const modelOptions: { value: "all" | ModelKey; label: string }[] = [
  { value: "all", label: "All" },
  { value: "gpt55", label: "GPT-5.5" },
  { value: "claude", label: "Claude" },
];

const rangeOptions: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
  { value: "1y", label: "1y" },
  { value: "all", label: "All" },
];

export function EvalFilters({
  model,
  evalSet,
  range,
  evalSets,
  onModelChange,
  onEvalSetChange,
  onRangeChange,
}: {
  model: "all" | ModelKey;
  evalSet: string;
  range: TimeRange;
  evalSets: EvalSetOption[];
  onModelChange: (model: "all" | ModelKey) => void;
  onEvalSetChange: (evalSet: string) => void;
  onRangeChange: (range: TimeRange) => void;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="flex flex-wrap items-center gap-2">
        <Bot className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        {modelOptions.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={model === option.value ? "default" : "secondary"}
            size="sm"
            onClick={() => onModelChange(option.value)}
            className="h-9"
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="flex min-w-56 items-center gap-2">
        <Database className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Select value={evalSet} onValueChange={onEvalSetChange}>
          <SelectTrigger aria-label="Eval set">
            <SelectValue placeholder="Eval set" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All eval sets</SelectItem>
            {evalSets.map((option) => (
              <SelectItem key={option.key} value={option.key}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <CalendarDays
          className="mr-1 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
        {rangeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onRangeChange(option.value)}
            className={cn(
              "h-9 rounded-[var(--radius)] px-3 text-sm font-medium transition-colors",
              range === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
