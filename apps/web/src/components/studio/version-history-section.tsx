"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BuilderVersion } from "@/lib/builder/version-history";
import { formatVersionTimestamp } from "./studio-documents";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

interface VersionHistorySectionProps {
  versions: BuilderVersion[];
  previewVersionId: string | null;
  manualVersionName: string;
  onCompareVersion: (id: string) => void;
  onPreviewVersion: (id: string) => void;
  onManualVersionNameChange: (name: string) => void;
  onSaveVersion: () => void;
}

export function VersionHistorySection({
  versions,
  previewVersionId,
  manualVersionName,
  onCompareVersion,
  onPreviewVersion,
  onManualVersionNameChange,
  onSaveVersion,
}: VersionHistorySectionProps) {
  const a11yT = useA11yTranslations();

  return (
    <div className="border-b-[length:var(--border-width)] px-4 py-3">
      <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">
        Version History
      </h2>
      <div className="space-y-1">
        {versions.length === 0 && (
          <p className="text-xs text-muted-foreground">No versions yet</p>
        )}
        {versions.map((version) => (
          <div
            key={version.id}
            className={cn(
              "flex items-center justify-between rounded-[var(--radius)] px-2 py-1.5 text-xs",
              previewVersionId === version.id
                ? "bg-primary/10 text-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <button
              type="button"
              className="min-w-0 flex-1 truncate text-left"
              onClick={() => onPreviewVersion(version.id)}
            >
              {version.name || formatVersionTimestamp(version.savedAt)}
            </button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="ml-2 h-7 shrink-0 px-2 text-xs"
              aria-label={`Compare ${
                version.name || formatVersionTimestamp(version.savedAt)
              } to current`}
              onClick={() => onCompareVersion(version.id)}
            >
              Compare to current
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="text"
          aria-label={a11yT("versionName")}
          placeholder={a11yT("versionName2")}
          value={manualVersionName}
          onChange={(event) => onManualVersionNameChange(event.target.value)}
          className="min-w-0 flex-1 rounded-[var(--radius)] border-[length:var(--border-width)] bg-background px-2 py-1 text-xs"
        />
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          onClick={onSaveVersion}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
