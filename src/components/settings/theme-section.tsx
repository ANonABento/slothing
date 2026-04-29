"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle, Palette, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_CUSTOM_THEME,
  THEME_PRESETS,
  applyThemePreference,
  hexToHslString,
  hslStringToHex,
  notifyThemePreferenceChanged,
  readThemePreference,
  saveThemePreference,
  type ThemeColorKey,
  type ThemeColors,
  type ThemePreference,
  type ThemePresetId,
} from "@/lib/theme/theme-presets";

const CUSTOM_LABELS: Record<ThemeColorKey, string> = {
  primary: "Primary",
  background: "Background",
  card: "Card",
};

export function ThemeSection() {
  const [preference, setPreference] = useState<ThemePreference>({
    presetId: "default",
    customColors: DEFAULT_CUSTOM_THEME,
  });

  useEffect(() => {
    const storedPreference = readThemePreference();
    setPreference(storedPreference);
    applyThemePreference(document.documentElement, storedPreference);
  }, []);

  const persistAndApply = (nextPreference: ThemePreference) => {
    setPreference(nextPreference);
    saveThemePreference(nextPreference);
    applyThemePreference(document.documentElement, nextPreference);
    notifyThemePreferenceChanged();
  };

  const selectPreset = (presetId: ThemePresetId) => {
    persistAndApply({ ...preference, presetId });
  };

  const updateCustomColor = (key: ThemeColorKey, hexColor: string) => {
    const customColors: ThemeColors = {
      ...preference.customColors,
      [key]: hexToHslString(hexColor),
    };
    persistAndApply({ presetId: "custom", customColors });
  };

  return (
    <section className="rounded-2xl border bg-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
          <Palette className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">Theme</h2>
          <p className="text-sm text-muted-foreground">Choose a preset or customize your workspace colors</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {THEME_PRESETS.map((preset) => (
          <ThemeChoiceButton
            key={preset.id}
            label={preset.label}
            description={preset.description}
            colors={preset.colors}
            selected={preference.presetId === preset.id}
            onClick={() => selectPreset(preset.id)}
          />
        ))}

        <ThemeChoiceButton
          label="Customize"
          description="Tune the primary, background, and card colors."
          colors={preference.customColors}
          selected={preference.presetId === "custom"}
          icon={<SlidersHorizontal className="h-4 w-4" />}
          onClick={() => selectPreset("custom")}
        />
      </div>

      {preference.presetId === "custom" && (
        <div className="mt-5 rounded-xl border bg-muted/30 p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {(Object.keys(CUSTOM_LABELS) as ThemeColorKey[]).map((key) => (
              <label key={key} className="space-y-2 text-sm font-medium">
                <span>{CUSTOM_LABELS[key]}</span>
                <input
                  type="color"
                  value={hslStringToHex(preference.customColors[key])}
                  onChange={(event) => updateCustomColor(key, event.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background p-1"
                  aria-label={`${CUSTOM_LABELS[key]} color`}
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {preference.presetId !== "default" && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-4"
          onClick={() => selectPreset("default")}
        >
          Reset to Taida
        </Button>
      )}
    </section>
  );
}

interface ThemeChoiceButtonProps {
  label: string;
  description: string;
  colors: ThemeColors;
  selected: boolean;
  icon?: ReactNode;
  onClick: () => void;
}

function ThemeChoiceButton({ label, description, colors, selected, icon, onClick }: ThemeChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative rounded-xl border-2 p-4 text-left transition-all ${
        selected ? "border-primary bg-primary/5" : "border-transparent bg-muted/50 hover:bg-muted"
      }`}
    >
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <div className="flex overflow-hidden rounded-md border">
          {(Object.keys(colors) as ThemeColorKey[]).map((key) => (
            <span
              key={key}
              className="h-7 w-9"
              style={{ backgroundColor: `hsl(${colors[key]})` }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
      <p className="font-medium">{label}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {selected && <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-primary" />}
    </button>
  );
}
