"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Calendar,
  Cloud,
  Loader2,
  RefreshCw,
  FileText,
  FolderOpen,
  Mail,
  Table,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PageSection } from "@/components/ui/page-layout";
import { SkeletonButton } from "@/components/ui/skeleton";
import { GOOGLE_FEATURES } from "@/lib/google/types";
import type { SettingsResponse } from "@/types/api";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

const GoogleConnectButton = dynamic(
  () =>
    import("@/components/google").then((module) => module.GoogleConnectButton),
  { loading: () => <SkeletonButton className="w-48" />, ssr: false },
);

const iconMap: Record<string, LucideIcon> = {
  Calendar,
  FolderOpen,
  Mail,
  FileText,
  Table,
  Users,
};

export function GoogleIntegration() {
  const a11yT = useA11yTranslations();

  const [pullEnabled, setPullEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/settings")
      .then((response) => response.json() as Promise<SettingsResponse>)
      .then((data) => {
        if (!mounted) return;
        setPullEnabled(data.calendarSync?.pullEnabled ?? false);
      })
      .catch(() => {
        if (mounted) setPullEnabled(false);
      })
      .finally(() => {
        if (mounted) setLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleToggle = async () => {
    const next = !pullEnabled;
    setPullEnabled(next);
    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calendarSync: { pullEnabled: next } }),
      });
      if (!response.ok) throw new Error("Failed to save calendar sync setting");
    } catch {
      setPullEnabled(!next);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageSection
      title={a11yT("googleIntegration")}
      description="Connect your Google account to sync calendars, store documents, and more."
      icon={Cloud}
      iconClassName="gradient-bg text-primary-foreground"
    >
      <div className="space-y-4">
        <GoogleConnectButton />

        <div className="pt-2 border-t">
          <h3 className="text-sm font-medium mb-3">Connected features:</h3>
          <div className="grid gap-2 sm:grid-cols-3">
            {GOOGLE_FEATURES.map((feature) => {
              const Icon = iconMap[feature.iconName];
              return (
                <div
                  key={feature.id}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Icon className={`h-4 w-4 ${feature.iconClassName}`} />
                  <span>{feature.label}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Connect your Google account to enable these features. Your data
            stays private and secure.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 border-t pt-4">
          <div className="min-w-0">
            <h3 className="text-sm font-medium">
              Auto-link detected interviews
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Google Calendar is checked every 30 minutes. Leave this off to get
              suggested updates you can accept or dismiss.
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggle}
            disabled={!loaded || saving}
            aria-pressed={pullEnabled}
            className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors ${
              pullEnabled
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background hover:bg-muted"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {pullEnabled ? "On" : "Off"}
          </button>
        </div>
      </div>
    </PageSection>
  );
}
