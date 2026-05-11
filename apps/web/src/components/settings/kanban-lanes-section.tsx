"use client";

import { useEffect, useState } from "react";
import { Columns3, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/ui/page-layout";
import { readJsonResponse } from "@/lib/http";
import {
  DEFAULT_KANBAN_VISIBLE_LANES,
  KANBAN_LANE_OPTIONS,
  normalizeKanbanVisibleLanes,
  type KanbanLaneId,
} from "@/app/[locale]/(app)/opportunities/utils";
import type { SettingsResponse } from "@/types/api";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

export function KanbanLanesSection() {
  const a11yT = useA11yTranslations();

  const [visibleLanes, setVisibleLanes] = useState<KanbanLaneId[]>([
    ...DEFAULT_KANBAN_VISIBLE_LANES,
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPreference() {
      try {
        const response = await fetch("/api/settings");
        const data = await readJsonResponse<SettingsResponse>(
          response,
          "Failed to load kanban lane setting",
        );
        setVisibleLanes(
          normalizeKanbanVisibleLanes(data.kanbanVisibleLanes ?? null),
        );
      } catch {
        setMessage("Could not load kanban lane setting.");
      } finally {
        setLoading(false);
      }
    }

    void fetchPreference();
  }, []);

  async function saveVisibleLanes(nextVisibleLanes: KanbanLaneId[]) {
    const previousVisibleLanes = visibleLanes;
    setVisibleLanes(nextVisibleLanes);
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kanbanVisibleLanes: nextVisibleLanes }),
      });
      await readJsonResponse<unknown>(
        response,
        "Failed to save kanban lane setting",
      );
      setMessage("Kanban lanes updated.");
    } catch {
      setVisibleLanes(previousVisibleLanes);
      setMessage("Could not save kanban lane setting.");
    } finally {
      setSaving(false);
    }
  }

  function toggleLane(lane: KanbanLaneId) {
    const isVisible = visibleLanes.includes(lane);
    if (isVisible && visibleLanes.length === 1) return;

    const nextVisibleLanes = isVisible
      ? visibleLanes.filter((visibleLane) => visibleLane !== lane)
      : normalizeKanbanVisibleLanes([...visibleLanes, lane]);
    void saveVisibleLanes(nextVisibleLanes);
  }

  const canReset =
    visibleLanes.length !== DEFAULT_KANBAN_VISIBLE_LANES.length ||
    visibleLanes.some(
      (lane, index) => lane !== DEFAULT_KANBAN_VISIBLE_LANES[index],
    );

  return (
    <PageSection
      title={a11yT("kanbanLanes")}
      description="Pick which lanes appear on the Opportunities Kanban. Order is fixed by the pipeline."
      icon={Columns3}
      action={
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            void saveVisibleLanes([...DEFAULT_KANBAN_VISIBLE_LANES])
          }
          disabled={loading || saving || !canReset}
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="mr-2 h-4 w-4" />
          )}
          Reset
        </Button>
      }
    >
      <div className="flex flex-wrap gap-2">
        {KANBAN_LANE_OPTIONS.map((lane) => {
          const isVisible = visibleLanes.includes(lane.value);
          const isLastVisible = isVisible && visibleLanes.length === 1;

          return (
            <Button
              key={lane.value}
              type="button"
              variant={isVisible ? "default" : "outline"}
              onClick={() => toggleLane(lane.value)}
              disabled={loading || saving || isLastVisible}
              aria-pressed={isVisible}
            >
              {lane.label}
            </Button>
          );
        })}
      </div>

      {visibleLanes.length === 1 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          At least one lane must remain visible.
        </p>
      ) : null}

      {message ? (
        <p className="mt-4 text-sm text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}
    </PageSection>
  );
}
