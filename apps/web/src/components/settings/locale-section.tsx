"use client";

import { Globe2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageSection } from "@/components/ui/page-layout";
import {
  getPreferredLocale,
  writePreferredLocale,
} from "@/components/format/time-ago";
import { useErrorToast } from "@/hooks/use-error-toast";
import { SUPPORTED_LOCALES, normalizeLocale } from "@/lib/format/time";
import { readJsonResponse } from "@/lib/http";
import type { SettingsResponse } from "@/types/api";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

export function LocaleSection() {
  const activeLocale = useLocale();
  const [locale, setLocale] = useState(() => normalizeLocale(activeLocale));
  const a11yT = useA11yTranslations();
  const [saving, setSaving] = useState(false);
  const showErrorToast = useErrorToast();

  useEffect(() => {
    let active = true;

    async function loadLocale() {
      try {
        const response = await fetch("/api/settings");
        const data = await readJsonResponse<SettingsResponse>(
          response,
          "Failed to load locale",
        );
        const nextLocale = normalizeLocale(data.locale ?? getPreferredLocale());
        if (!active) return;
        setLocale(nextLocale);
        writePreferredLocale(nextLocale);
      } catch (error) {
        if (!active) return;
        setLocale(getPreferredLocale());
        showErrorToast(error, {
          title: "Could not load locale",
          fallbackDescription: "Your browser locale is being used.",
        });
      }
    }

    void loadLocale();
    return () => {
      active = false;
    };
  }, [showErrorToast]);

  async function handleLocaleChange(nextLocale: string) {
    const normalized = normalizeLocale(nextLocale);
    const previousLocale = locale;
    setLocale(normalized);
    writePreferredLocale(normalized);
    setSaving(true);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: normalized }),
      });

      if (!response.ok) {
        throw new Error("Failed to save locale");
      }
    } catch (error) {
      setLocale(previousLocale);
      writePreferredLocale(previousLocale);
      showErrorToast(error, {
        title: "Could not save locale",
        fallbackDescription: "Your previous locale has been restored.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageSection
      title={a11yT("locale")}
      description="Format dates and numbers for your region."
      icon={Globe2}
      action={
        saving ? (
          <Loader2
            className="mt-1 h-4 w-4 animate-spin text-muted-foreground"
            aria-label={a11yT("savingLocale")}
          />
        ) : null
      }
    >
      <Select
        value={locale}
        onValueChange={(value) => void handleLocaleChange(value)}
      >
        <SelectTrigger aria-label={a11yT("locale")}>
          <SelectValue placeholder={a11yT("selectLocale")} />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LOCALES.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </PageSection>
  );
}
