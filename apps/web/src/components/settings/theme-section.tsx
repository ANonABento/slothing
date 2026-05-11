"use client";

import { CheckCircle, Moon, Palette, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/ui/page-layout";
import { useTheme } from "@/components/theme-provider";
import type { ThemePreset } from "@/lib/theme/tokens";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

export function ThemeSection() {
  const a11yT = useA11yTranslations();

  const { isDark, toggleDark, themeId, setThemeId, availableThemes } =
    useTheme();

  return (
    <PageSection
      title={a11yT("theme")}
      description="Choose a preset or adjust workspace colors."
      icon={Palette}
      action={
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={isDark ? "default" : "outline"}
            size="sm"
            onClick={toggleDark}
            aria-pressed={isDark}
          >
            {isDark ? (
              <Moon className="mr-2 h-4 w-4" />
            ) : (
              <Sun className="mr-2 h-4 w-4" />
            )}
            Dark
          </Button>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {availableThemes.map((preset) => (
          <ThemePresetCard
            key={preset.id}
            preset={preset}
            selected={themeId === preset.id}
            onClick={() => setThemeId(preset.id)}
          />
        ))}
      </div>
    </PageSection>
  );
}

interface ThemePresetCardProps {
  preset: ThemePreset;
  selected: boolean;
  onClick: () => void;
}

function ThemePresetCard({ preset, selected, onClick }: ThemePresetCardProps) {
  const previewKeys = Object.keys(
    preset.preview,
  ) as (keyof typeof preset.preview)[];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`Select ${preset.name} theme`}
      className={`relative rounded-lg border-2 p-4 text-left transition-all ${
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-transparent bg-muted/50 hover:bg-muted"
      }`}
    >
      <div className="mb-4 flex overflow-hidden rounded-md border">
        {previewKeys.map((key) => (
          <span
            key={key}
            className="h-7 flex-1"
            style={{ backgroundColor: preset.preview[key] }}
            title={`${preset.name} ${key}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="font-medium">{preset.name}</p>
      <p className="mt-1 text-sm text-muted-foreground">{preset.description}</p>
      {selected && (
        <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-primary" />
      )}
    </button>
  );
}
