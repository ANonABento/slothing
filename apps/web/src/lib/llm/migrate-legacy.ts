import {
  migrateLegacyLLMConfig,
  type BentoRouterApi,
} from "@anonabento/bento-router";
import * as dbModule from "@/lib/db";
import type { LLMConfig } from "@/types";
import { SLOTHING_TASK_IDS } from "./tasks";
import { getBentoRouterClient } from "./bentorouter-client";

const MIGRATION_STATUS_KEY = "bentorouter_migration_status";
const MIGRATED = "migrated";

export type LegacyMigrationResult = {
  migrated: boolean;
  providerId?: string;
  taskCount: number;
};

export async function migrateLegacyLLMSettingsForUser(
  userId: string,
): Promise<LegacyMigrationResult> {
  ensureUserMigrationColumn();
  if (getMigrationStatus(userId) === MIGRATED) {
    return { migrated: false, taskCount: 0 };
  }

  const legacy = getLegacyLLMConfig(userId);
  const client = await getBentoRouterClient();
  const result = await migrateLegacyConfigIntoBentoRouter({
    userId,
    legacy,
    api: client.api(userId),
  });
  setMigrationStatus(userId, MIGRATED);
  return result;
}

export async function migrateLegacyConfigIntoBentoRouter({
  userId,
  legacy,
  api,
}: {
  userId: string;
  legacy: LLMConfig | null;
  api: BentoRouterApi;
}): Promise<LegacyMigrationResult> {
  if (!legacy) return { migrated: true, taskCount: 0 };

  const output = migrateLegacyLLMConfig(legacy, {
    userId,
    taskIds: [...SLOTHING_TASK_IDS],
    displayName: legacyDisplayName(legacy),
  });

  let providerId: string | undefined;
  if (output.provider) {
    const existing = await api.listConfiguredProviders(userId);
    const matchingProvider = existing.find(
      (provider) =>
        provider.type === output.provider!.type &&
        provider.displayName === output.provider!.displayName,
    );
    providerId =
      matchingProvider?.id ??
      (await api.addConfiguredProvider(output.provider)).id;
  }

  for (const [taskId, policy] of Object.entries(output.taskPolicies)) {
    await api.updateTaskPolicy(taskId, policy);
  }

  return {
    migrated: true,
    providerId,
    taskCount: Object.keys(output.taskPolicies).length,
  };
}

function getMigrationStatus(userId: string): string | null {
  if (
    !("getSetting" in dbModule) ||
    typeof dbModule.getSetting !== "function"
  ) {
    return null;
  }
  return dbModule.getSetting(MIGRATION_STATUS_KEY, userId);
}

function setMigrationStatus(userId: string, status: string): void {
  if ("setSetting" in dbModule && typeof dbModule.setSetting === "function") {
    dbModule.setSetting(MIGRATION_STATUS_KEY, status, userId);
  }
  try {
    dbModule.db
      .prepare("UPDATE `user` SET llm_migration_status = ? WHERE id = ?")
      .run(status, userId);
  } catch {
    // The local-dev default user does not always have a NextAuth user row.
  }
}

function ensureUserMigrationColumn(): void {
  try {
    const columns = dbModule.db
      .prepare("PRAGMA table_info(`user`)")
      .all() as unknown as Array<{
      name: string;
    }>;
    if (!columns.some((column) => column.name === "llm_migration_status")) {
      dbModule.db
        .prepare(
          "ALTER TABLE `user` ADD COLUMN llm_migration_status TEXT DEFAULT 'pending'",
        )
        .run();
    }
  } catch {
    // Some tests mock the settings table only; the settings status remains the gate.
  }
}

function getLegacyLLMConfig(userId: string): LLMConfig | null {
  if (
    !("getLLMConfig" in dbModule) ||
    typeof dbModule.getLLMConfig !== "function"
  ) {
    return null;
  }
  return dbModule.getLLMConfig(userId);
}

function legacyDisplayName(legacy: LLMConfig): string {
  switch (legacy.provider) {
    case "openai":
      return "OpenAI";
    case "anthropic":
      return "Anthropic";
    case "openrouter":
      return "OpenRouter";
    case "ollama":
      return "Ollama";
  }
}
