"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useErrorToast } from "@/hooks/use-error-toast";

type SyncType = "all" | "interviews" | "deadlines" | "reminders";

interface SyncResultItem {
  type: "interview" | "deadline" | "reminder";
  title: string;
  success: boolean;
  eventLink?: string;
  error?: string;
}

interface SyncResponse {
  success: boolean;
  synced: number;
  failed: number;
  results: SyncResultItem[];
}

interface CalendarSyncButtonProps {
  onSyncComplete?: (result: SyncResponse) => void;
  compact?: boolean;
  hideWhenDisconnected?: boolean;
}

export function CalendarSyncButton({
  onSyncComplete,
  compact = false,
  hideWhenDisconnected = false,
}: CalendarSyncButtonProps) {
  const t = useTranslations("integrations.google.calendar");
  const [syncing, setSyncing] = useState(false);
  const [syncType, setSyncType] = useState<SyncType>("all");
  const [result, setResult] = useState<SyncResponse | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);
  const showErrorToast = useErrorToast();

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    try {
      const res = await fetch("/api/google/auth");
      const data = await res.json();
      setConnected(data.connected);
    } catch {
      setConnected(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    setResult(null);

    try {
      const res = await fetch("/api/google/calendar/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syncType }),
      });

      const data: SyncResponse = await res.json();
      setResult(data);
      onSyncComplete?.(data);
    } catch (error) {
      showErrorToast(error, {
        title: t("errors.syncTitle"),
        fallbackDescription: t("errors.syncDescription"),
      });
      setResult({
        success: false,
        synced: 0,
        failed: 1,
        results: [
          {
            type: "interview",
            title: t("errors.syncFailed"),
            success: false,
            error: "Network error",
          },
        ],
      });
    } finally {
      setSyncing(false);
    }
  }

  if (connected === false) {
    if (hideWhenDisconnected) return null;

    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4" />
        <span>{t("connectInSettings")}</span>
      </div>
    );
  }

  // Still loading connection status
  if (connected === null) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {t("checking")}
      </Button>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <Button
          onClick={handleSync}
          disabled={syncing}
          size="sm"
          className="w-full"
        >
          {syncing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("syncing")}
            </>
          ) : (
            <>
              <Calendar className="mr-2 h-4 w-4" />
              {t("actions.sync")}
            </>
          )}
        </Button>

        {result && (
          <p className="text-xs text-center">
            {result.success ? (
              <span className="text-success">
                {t("result.synced", { count: result.synced })}
              </span>
            ) : (
              <span className="text-warning">
                {t("result.partial", {
                  synced: result.synced,
                  failed: result.failed,
                })}
              </span>
            )}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select
          value={syncType}
          onValueChange={(v) => setSyncType(v as SyncType)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("selectPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("syncTypes.all")}</SelectItem>
            <SelectItem value="interviews">
              {t("syncTypes.interviews")}
            </SelectItem>
            <SelectItem value="deadlines">
              {t("syncTypes.deadlines")}
            </SelectItem>
            <SelectItem value="reminders">
              {t("syncTypes.reminders")}
            </SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSync} disabled={syncing}>
          {syncing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("syncing")}
            </>
          ) : (
            <>
              <Calendar className="mr-2 h-4 w-4" />
              {t("actions.sync")}
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      {result && (
        <div
          className={`rounded-lg border p-4 ${
            result.success
              ? "bg-success/10 border-success/30"
              : "bg-warning/10 border-warning/30"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <AlertCircle className="h-5 w-5 text-warning" />
            )}
            <span className="font-medium">
              {result.success
                ? t("result.success", { count: result.synced })
                : t("result.failed", {
                    synced: result.synced,
                    failed: result.failed,
                  })}
            </span>
          </div>

          {result.results.length > 0 && (
            <div className="mt-3 space-y-1 max-h-40 overflow-y-auto">
              {result.results.slice(0, 10).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {item.success ? (
                      <CheckCircle className="h-3 w-3 text-success shrink-0" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-destructive shrink-0" />
                    )}
                    <span className="truncate">{item.title}</span>
                  </div>
                  {item.eventLink && (
                    <a
                      href={item.eventLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 shrink-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
              {result.results.length > 10 && (
                <p className="text-xs text-muted-foreground pt-1">
                  {t("result.more", { count: result.results.length - 10 })}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
