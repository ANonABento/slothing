import { homedir } from "node:os";
import { join } from "node:path";
import {
  BentoRouter,
  CircuitBreaker,
  JsonFilePolicyStore,
  JsonFileProviderConfigStore,
  JsonFileUsageStore,
  ModelRegistry,
  ProviderRegistry,
  TaskRegistry,
  createAnthropicProvider,
  createBentoRouterApi,
  createOpenAIProvider,
  createOpenRouterProvider,
  createProviderAdapterFromConfig,
  type BentoRouterApi,
  type BentoRouterInput,
  type BentoRouterResult,
  type ProviderStreamChunk,
} from "@anonabento/bento-router";
import { createBentoRouterEncryptionAdapter } from "./encryption";
import {
  SLOTHING_MODEL_PROFILES,
  registerSlothingTasks,
  type SlothingTaskId,
} from "./tasks";

export type BentoRunInput = Omit<BentoRouterInput, "task"> & {
  task: SlothingTaskId;
};

export interface BentoRouterClient {
  run(input: BentoRunInput): Promise<BentoRouterResult>;
  stream(input: BentoRunInput): AsyncIterable<ProviderStreamChunk>;
  api(userId?: string): BentoRouterApi;
}

export type BentoRouterClientOptions = {
  rootDir?: string;
  env?: Record<string, string | undefined>;
};

let singleton: BentoRouterClient | null = null;

export function resetBentoRouterClientForTests(): void {
  singleton = null;
}

export async function getBentoRouterClient(
  options: BentoRouterClientOptions = {},
): Promise<BentoRouterClient> {
  singleton ??= createEmbeddedBentoRouterClient(options);
  return singleton;
}

export function createEmbeddedBentoRouterClient(
  options: BentoRouterClientOptions = {},
): BentoRouterClient {
  const env = options.env ?? process.env;
  const rootDir =
    options.rootDir ?? join(homedir(), ".slothing", "bento-router");

  const taskRegistry = new TaskRegistry();
  registerSlothingTasks(taskRegistry);

  const modelRegistry = new ModelRegistry();
  for (const model of SLOTHING_MODEL_PROFILES) {
    modelRegistry.register(model);
  }

  const usageStore = new JsonFileUsageStore(join(rootDir, "usage.json"));
  const providerConfigStore = new JsonFileProviderConfigStore(
    join(rootDir, "providers.json"),
  );
  const encryption = createBentoRouterEncryptionAdapter(env);
  const circuitBreaker = new CircuitBreaker();

  const runtimeForUser = async (userId = "default") => {
    const policyStore = new JsonFilePolicyStore(
      join(rootDir, "policies", `${encodeURIComponent(userId)}.json`),
    );
    const providerRegistry = await providerRegistryForUser({
      userId,
      env,
      providerConfigStore,
      encryption,
    });
    const router = new BentoRouter({
      taskRegistry,
      modelRegistry,
      providerRegistry,
      usageStore,
      policyStore,
      providerConfigStore,
      encryption,
      circuitBreaker,
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
      circuitBreaker,
    });
    return { router, api };
  };

  return {
    async run(input) {
      const { router } = await runtimeForUser(input.userId);
      return (await router.run(input)) as BentoRouterResult;
    },
    async *stream(input) {
      const { router } = await runtimeForUser(input.userId);
      yield* router.stream(input);
    },
    api(userId = "default") {
      const policyStore = new JsonFilePolicyStore(
        join(rootDir, "policies", `${encodeURIComponent(userId)}.json`),
      );
      const providerRegistry = new ProviderRegistry();
      registerEnvProviders(providerRegistry, env);
      const router = new BentoRouter({
        taskRegistry,
        modelRegistry,
        providerRegistry,
        usageStore,
        policyStore,
        providerConfigStore,
        encryption,
        circuitBreaker,
      });
      return createBentoRouterApi({
        router,
        taskRegistry,
        modelRegistry,
        providerRegistry,
        usageStore,
        policyStore,
        providerConfigStore,
        encryption,
        circuitBreaker,
      });
    },
  };
}

async function providerRegistryForUser({
  userId,
  env,
  providerConfigStore,
  encryption,
}: {
  userId: string;
  env: Record<string, string | undefined>;
  providerConfigStore: JsonFileProviderConfigStore;
  encryption: ReturnType<typeof createBentoRouterEncryptionAdapter>;
}): Promise<ProviderRegistry> {
  const providerRegistry = new ProviderRegistry();
  registerEnvProviders(providerRegistry, env);
  const registeredTypeAliases = new Set<string>();

  for (const config of await providerConfigStore.list(userId)) {
    const adapters = await createProviderAdapterFromConfig(config, {
      encryption,
      registerTypeAlias:
        !registeredTypeAliases.has(config.type) &&
        !providerRegistry.get(config.type),
    });
    for (const adapter of adapters) {
      providerRegistry.register(adapter);
      if (adapter.id === config.type) {
        registeredTypeAliases.add(config.type);
      }
    }
  }

  return providerRegistry;
}

function registerEnvProviders(
  providerRegistry: ProviderRegistry,
  env: Record<string, string | undefined>,
): void {
  if (env.OPENAI_API_KEY) {
    providerRegistry.register(
      createOpenAIProvider({ apiKey: env.OPENAI_API_KEY }),
    );
  }
  if (env.ANTHROPIC_API_KEY) {
    providerRegistry.register(
      createAnthropicProvider({ apiKey: env.ANTHROPIC_API_KEY }),
    );
  }
  if (env.OPENROUTER_API_KEY) {
    providerRegistry.register(
      createOpenRouterProvider({ apiKey: env.OPENROUTER_API_KEY }),
    );
  }
}
