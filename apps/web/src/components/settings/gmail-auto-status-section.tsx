"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, MailCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/ui/page-layout";
import { formatAbsolute } from "@/lib/format/time";
import { readJsonResponse } from "@/lib/http";
import type { SettingsResponse } from "@/types/api";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

export function GmailAutoStatusSection() {
  const a11yT = useA11yTranslations();

  const [enabled, setEnabled] = useState(false);
  const [lastScannedAt, setLastScannedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPreference() {
      try {
        const response = await fetch("/api/settings");
        const data = await readJsonResponse<SettingsResponse>(
          response,
          "Failed to load Gmail auto-status setting",
        );
        setEnabled(Boolean(data.gmailAutoStatus?.enabled));
        setLastScannedAt(data.gmailAutoStatus?.lastScannedAt ?? null);
      } catch {
        setMessage("Could not load Gmail auto-status setting.");
      } finally {
        setLoading(false);
      }
    }

    void fetchPreference();
  }, []);

  const toggleEnabled = async () => {
    const nextEnabled = !enabled;
    setEnabled(nextEnabled);
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gmailAutoStatus: {
            enabled: nextEnabled,
          },
        }),
      });

      await readJsonResponse<unknown>(
        response,
        "Failed to save Gmail auto-status setting",
      );
      setMessage(
        nextEnabled
          ? "Gmail auto-status enabled."
          : "Gmail auto-status disabled.",
      );
    } catch {
      setEnabled(!nextEnabled);
      setMessage("Could not save Gmail auto-status setting.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageSection
      title={a11yT("gmailAutoStatus")}
      description="Opt in to daily Gmail scans that advance matched opportunity statuses."
      icon={MailCheck}
      action={
        <Button
          type="button"
          variant={enabled ? "default" : "outline"}
          onClick={toggleEnabled}
          disabled={loading || saving}
          aria-pressed={enabled}
          className="w-full shrink-0 sm:w-auto"
        >
          {loading || saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : enabled ? (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          ) : (
            <XCircle className="mr-2 h-4 w-4" />
          )}
          {enabled ? "Enabled" : "Disabled"}
        </Button>
      }
    >
      <p className="text-sm text-muted-foreground">
        Default off. When enabled, Slothing scans recent inbox messages for job
        status updates and only moves opportunities forward.
      </p>
      {lastScannedAt && (
        <p className="mt-2 text-xs text-muted-foreground">
          Last scanned {formatAbsolute(lastScannedAt)}.
        </p>
      )}
      {message && (
        <p className="mt-4 text-sm text-muted-foreground" role="status">
          {message}
        </p>
      )}
    </PageSection>
  );
}
