"use client";

import { useEffect, useState } from "react";
import { Bot, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageSection } from "@/components/ui/page-layout";
import { readJsonResponse } from "@/lib/http";
import { cn } from "@/lib/utils";
import {
  AUTONOMY_LEVELS,
  type AgentPolicy,
  type AutonomyLevel,
  DEFAULT_AGENT_POLICY,
  allowsSubmission,
} from "@/lib/agent/policy";

const LEVEL_META: Record<AutonomyLevel, { label: string; blurb: string }> = {
  off: { label: "Off", blurb: "The agent does nothing." },
  source: {
    label: "Source",
    blurb: "Scrape + rank jobs into your review queue. You apply yourself.",
  },
  draft: {
    label: "Draft",
    blurb:
      "Also pre-draft grounded answers, left for you to review before anything is sent.",
  },
  submit_approval: {
    label: "Submit · approval",
    blurb:
      "Also submit — but only applications you approve. Nothing is sent unattended.",
  },
  auto_submit: {
    label: "Auto-submit",
    blurb:
      "Submit unattended within your rules. Review after the fact. Highest power, highest risk.",
  },
};

function toCsv(values: string[]): string {
  return values.join(", ");
}

function fromCsv(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function AgentAutonomySection() {
  const [policy, setPolicy] = useState<AgentPolicy>(DEFAULT_AGENT_POLICY);
  const [blocklistText, setBlocklistText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/agent/settings");
        const data = await readJsonResponse<{ policy: AgentPolicy }>(
          response,
          "Failed to load agent settings",
        );
        setPolicy(data.policy);
        setBlocklistText(toCsv(data.policy.companyBlocklist));
      } catch {
        setMessage("Could not load agent settings.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const update = <K extends keyof AgentPolicy>(
    key: K,
    value: AgentPolicy[K],
  ) => {
    setPolicy((prev) => ({ ...prev, [key]: value }));
    setMessage(null);
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/agent/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          autonomy: policy.autonomy,
          matchThreshold: policy.matchThreshold,
          salaryFloor: policy.salaryFloor,
          companyBlocklist: fromCsv(blocklistText),
          dailySubmitCap: policy.dailySubmitCap,
          dryRun: policy.dryRun,
          scheduleCron: policy.scheduleCron,
        }),
      });
      const data = await readJsonResponse<{ policy: AgentPolicy }>(
        response,
        "Failed to save agent settings",
      );
      setPolicy(data.policy);
      setBlocklistText(toCsv(data.policy.companyBlocklist));
      setMessage("Agent settings saved.");
    } catch {
      setMessage("Could not save agent settings.");
    } finally {
      setSaving(false);
    }
  };

  const submissionEnabled = allowsSubmission(policy.autonomy);

  return (
    <PageSection
      title="Overnight agent"
      description="How far an external agent (via the Slothing MCP server) may act on your behalf."
      icon={Bot}
    >
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <Label className="mb-2 block">Autonomy level</Label>
            <div className="flex flex-wrap gap-1.5" role="radiogroup">
              {AUTONOMY_LEVELS.map((level) => {
                const active = policy.autonomy === level;
                return (
                  <button
                    key={level}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => update("autonomy", level)}
                    className={cn(
                      "min-h-9 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {LEVEL_META[level].label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {LEVEL_META[policy.autonomy].blurb}
            </p>
          </div>

          {submissionEnabled && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-foreground">
              <ShieldAlert
                className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
                aria-hidden
              />
              <span>
                This level lets the agent submit real applications. Keep{" "}
                <strong>dry-run</strong> on until you trust its drafts — nothing
                is ever sent while dry-run is enabled.
              </span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="agent-threshold">Match threshold (0–1)</Label>
              <Input
                id="agent-threshold"
                type="number"
                min={0}
                max={1}
                step={0.05}
                value={policy.matchThreshold}
                onChange={(e) =>
                  update("matchThreshold", Number(e.target.value))
                }
              />
            </div>
            <div>
              <Label htmlFor="agent-salary">Salary floor (optional)</Label>
              <Input
                id="agent-salary"
                type="number"
                min={0}
                step={1000}
                value={policy.salaryFloor ?? ""}
                onChange={(e) =>
                  update(
                    "salaryFloor",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="agent-cap">Daily submit cap</Label>
              <Input
                id="agent-cap"
                type="number"
                min={0}
                max={1000}
                step={1}
                value={policy.dailySubmitCap}
                onChange={(e) =>
                  update("dailySubmitCap", Number(e.target.value))
                }
              />
            </div>
            <div>
              <Label htmlFor="agent-cron">Schedule (cron, informational)</Label>
              <Input
                id="agent-cron"
                type="text"
                placeholder="0 2 * * *"
                value={policy.scheduleCron ?? ""}
                onChange={(e) => update("scheduleCron", e.target.value || null)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="agent-blocklist">Company blocklist</Label>
            <Input
              id="agent-blocklist"
              type="text"
              placeholder="acme, globex"
              value={blocklistText}
              onChange={(e) => setBlocklistText(e.target.value)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Comma-separated. The agent never acts on these companies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant={policy.dryRun ? "default" : "outline"}
              onClick={() => update("dryRun", !policy.dryRun)}
              aria-pressed={policy.dryRun}
            >
              Dry-run: {policy.dryRun ? "on" : "off"}
            </Button>
            <Button type="button" onClick={() => void save()} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
            {message && (
              <span className="text-sm text-muted-foreground" role="status">
                {message}
              </span>
            )}
          </div>
        </div>
      )}
    </PageSection>
  );
}
