import { describe, expect, it } from "vitest";
import {
  BentoRouter,
  MemoryPolicyStore,
  MemoryProviderConfigStore,
  MemoryUsageStore,
  ModelRegistry,
  ProviderRegistry,
  TaskRegistry,
  createBentoRouterApi,
  type EncryptionAdapter,
} from "@anonabento/bento-router";
import { migrateLegacyConfigIntoBentoRouter } from "./migrate-legacy";
import {
  SLOTHING_MODEL_PROFILES,
  SLOTHING_TASK_IDS,
  registerSlothingTasks,
} from "./tasks";
import type { LLMConfig } from "@/types";

describe("migrateLegacyConfigIntoBentoRouter", () => {
  it.each([
    [
      "openai direct",
      { provider: "openai", apiKey: "sk-openai", model: "gpt-4o-mini" },
      "openai/gpt-4o-mini",
      "openai",
    ],
    [
      "anthropic direct",
      {
        provider: "anthropic",
        apiKey: "sk-ant",
        model: "claude-3-haiku-20240307",
      },
      "anthropic/claude-3-haiku-20240307",
      "anthropic",
    ],
    [
      "openrouter",
      {
        provider: "openrouter",
        apiKey: "sk-or",
        model: "openrouter/openai/gpt-4o-mini",
      },
      "openrouter/openai/gpt-4o-mini",
      "openrouter",
    ],
  ] satisfies Array<[string, LLMConfig, string, string]>)(
    "migrates %s",
    async (_label, legacy, expectedModel, expectedType) => {
      const { api, policyStore, providerConfigStore } = makeApi();

      const result = await migrateLegacyConfigIntoBentoRouter({
        userId: "user-a",
        legacy,
        api,
      });

      expect(result).toEqual({
        migrated: true,
        providerId: expect.any(String),
        taskCount: SLOTHING_TASK_IDS.length,
      });
      expect(await providerConfigStore.list("user-a")).toMatchObject([
        { type: expectedType, userId: "user-a" },
      ]);
      const overrides = await policyStore.read();
      for (const taskId of SLOTHING_TASK_IDS) {
        expect(overrides.task?.[taskId]?.primaryModel).toBe(expectedModel);
      }
    },
  );

  it("is a no-op when there is no legacy config", async () => {
    const { api, providerConfigStore } = makeApi();

    const result = await migrateLegacyConfigIntoBentoRouter({
      userId: "user-a",
      legacy: null,
      api,
    });

    expect(result).toEqual({ migrated: true, taskCount: 0 });
    expect(await providerConfigStore.list("user-a")).toEqual([]);
  });
});

function makeApi() {
  const taskRegistry = new TaskRegistry();
  registerSlothingTasks(taskRegistry);
  const modelRegistry = new ModelRegistry();
  for (const model of SLOTHING_MODEL_PROFILES) modelRegistry.register(model);
  const providerRegistry = new ProviderRegistry();
  const usageStore = new MemoryUsageStore();
  const policyStore = new MemoryPolicyStore();
  const providerConfigStore = new MemoryProviderConfigStore();
  const encryption: EncryptionAdapter = {
    scheme: "test-v1",
    async encrypt(plaintext) {
      return `test-v1:${plaintext}`;
    },
    async decrypt(stored) {
      return stored.replace(/^test-v1:/, "");
    },
  };
  const router = new BentoRouter({
    taskRegistry,
    modelRegistry,
    providerRegistry,
    usageStore,
    policyStore,
    providerConfigStore,
    encryption,
  });
  const api = createBentoRouterApi({
    router,
    taskRegistry,
    modelRegistry,
    providerRegistry,
    usageStore,
    policyStore,
    providerConfigStore,
    encryption,
  });

  return { api, policyStore, providerConfigStore };
}
