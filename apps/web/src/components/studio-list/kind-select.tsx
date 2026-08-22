"use client";

/**
 * The kind picker. One control, used at create time, at import time, and on an existing
 * document — so a mislabelled document is always one click from correct.
 */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TexDocumentKind } from "@/lib/db/tex-documents";
import { cn } from "@/lib/utils";

import { KIND_OPTIONS } from "./types";

export function KindSelect({
  value,
  onChange,
  disabled,
  label = "Type",
  className,
}: {
  value: TexDocumentKind;
  onChange: (kind: TexDocumentKind) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next as TexDocumentKind)}
      disabled={disabled}
    >
      <SelectTrigger aria-label={label} className={cn("h-9", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {KIND_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
