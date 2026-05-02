"use client";

import { CheckCircle, Moon, Palette, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import type { ThemePreset } from "@/lib/theme/tokens";

export function ThemeSection() {
  const {
    isDark,
    setTheme,
    themePreset,
    setThemePreset,
    availableThemePresets,
  } = useTheme();

  const toggleDarkMode = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <section className="rounded-2xl border bg-card p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">Theme</h2>
            <p className="text-sm text-muted-foreground">
              Choose a preset or adjust workspace colors.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant={isDark ? "default" : "outline"}
            size="sm"
            onClick={toggleDarkMode}
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
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {availableThemePresets.map((preset) => (
          <ThemePresetCard
            key={preset.id}
            preset={preset}
            selected={themePreset === preset.id}
            onClick={() => setThemePreset(preset.id)}
          />
        ))}
      </div>
    </section>
  );
}

interface ThemePresetCardProps {
  preset: ThemePreset;
  selected: boolean;
  onClick: () => void;
}

function ThemePresetCard({ preset, selected, onClick }: ThemePresetCardProps) {
  const previewEntries = Object.entries(preset.preview) as [
    keyof typeof preset.preview,
    string,
  ][];

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
        {previewEntries.map(([key, color]) => (
          <span
            key={key}
            className="h-7 flex-1"
            style={{ backgroundColor: color }}
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
