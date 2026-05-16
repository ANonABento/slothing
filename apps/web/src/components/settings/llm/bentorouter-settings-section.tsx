"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { BentoRouterAdminPage } from "@anonabento/bento-router/admin/BentoRouterAdminPage";
import { BentoRouterUsageTable } from "@anonabento/bento-router/admin/BentoRouterUsageTable";
import {
  type AddProviderInput,
  type ProviderConfigSummary,
  type ValidateProviderInput,
  type ValidateProviderResult,
} from "@anonabento/bento-router";
import { Bot } from "lucide-react";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageSection } from "@/components/ui/page-layout";

type TaskSummary = Parameters<typeof BentoRouterAdminPage>[0]["tasks"][number];
type ModelOption = NonNullable<
  Parameters<typeof BentoRouterAdminPage>[0]["models"]
>[number];
type UsageRow = Parameters<typeof BentoRouterUsageTable>[0]["rows"][number];

export function BentoRouterSettingsSection() {
  const [providers, setProviders] = useState<ProviderConfigSummary[]>([]);
  const [tasks, setTasks] = useState<TaskSummary[]>([]);
  const [models, setModels] = useState<ModelOption[]>([]);
  const [usageRows, setUsageRows] = useState<UsageRow[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { confirm, dialog: confirmDialog } = useConfirmDialog();

  const load = useCallback(async () => {
    setError(null);
    try {
      const [providersResponse, usageResponse] = await Promise.all([
        fetch("/api/settings/llm/providers"),
        fetch("/api/settings/llm/usage"),
      ]);
      if (!providersResponse.ok) throw new Error("Could not load AI settings.");
      const providerData = await providersResponse.json();
      const usageData = usageResponse.ok
        ? await usageResponse.json()
        : { rows: [] };
      setProviders(providerData.providers ?? []);
      setTasks(providerData.tasks ?? []);
      setModels(providerData.models ?? []);
      setUsageRows(usageData.rows ?? []);
      setSelectedTaskId((current) => current ?? providerData.tasks?.[0]?.id);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load AI settings.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addProvider(input: AddProviderInput) {
    const response = await fetch("/api/settings/llm/providers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.error ?? "Could not add provider.");
    }
    await load();
  }

  async function removeProvider(_userId: string, id: string) {
    const confirmed = await confirm({
      title: "Remove this provider key?",
      description:
        "This permanently removes the stored provider key from Slothing. AI tasks using this provider will stop working until another provider or policy is configured.",
      confirmLabel: "Remove key",
    });
    if (!confirmed) return;

    const response = await fetch("/api/settings/llm/providers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.error ?? "Could not remove provider.");
    }
    await load();
  }

  async function validateProvider(
    input: ValidateProviderInput,
  ): Promise<ValidateProviderResult> {
    const response = await fetch("/api/settings/llm/providers/draft/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const body = await response.json();
    return body;
  }

  async function updateTaskPolicy(
    taskId: string,
    policy: Record<string, unknown>,
  ) {
    const response = await fetch(
      `/api/settings/llm/policies/${encodeURIComponent(taskId)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(policy),
      },
    );
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.error ?? "Could not update task policy.");
    }
    await load();
  }

  return (
    <>
      <PageSection
        title="AI providers"
        description="Add provider keys, assign models by task, and inspect usage."
        icon={Bot}
        contentClassName="space-y-6"
      >
        {loading ? (
          <p className="text-sm text-muted-foreground">
            Loading AI settings...
          </p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <>
            {providers.length === 0 ? (
              <p className="text-sm leading-6 text-muted-foreground">
                Add at least one provider before using AI features. OpenRouter
                is the fastest way to enable the default task policies.
              </p>
            ) : null}
            <div
              className="bento-router-admin"
              style={
                {
                  "--bento-router-bg": "var(--card)",
                  "--bento-router-fg": "var(--foreground)",
                  "--bento-router-muted": "var(--muted-foreground)",
                  "--bento-router-border": "var(--border)",
                  "--bento-router-accent": "var(--primary)",
                  "--bento-router-font-sans": "var(--font-sans)",
                  "--bento-router-font-mono": "var(--font-mono)",
                  "--bento-router-radius": "var(--radius)",
                } as CSSProperties
              }
            >
              <BentoRouterAdminPage
                tasks={tasks}
                models={models}
                providers={providers}
                selectedTaskId={selectedTaskId}
                onSelectTask={setSelectedTaskId}
                onAddProvider={addProvider}
                onRemoveProvider={removeProvider}
                onValidateProvider={validateProvider}
                onPolicyChange={(taskId, policy) =>
                  void updateTaskPolicy(taskId, policy)
                }
              />
            </div>
            <BentoRouterUsageTable rows={usageRows} />
          </>
        )}
      </PageSection>
      {confirmDialog}
    </>
  );
}
