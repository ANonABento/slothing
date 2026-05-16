import { NextResponse } from "next/server";

import * as dbModule from "@/lib/db";
import { getBentoRouterClient } from "@/lib/llm/bentorouter-client";
import { migrateLegacyLLMSettingsForUser } from "@/lib/llm/migrate-legacy";
import {
  deductCredits,
  refundCredits,
  type CreditFeature,
  type CreditTransactionRecord,
} from "@/lib/db/credits";
import { getUserPlan, type UserPlan } from "./plans";
import type { BentoLLMConfig } from "@/lib/llm/client";

export interface AiGatePass {
  allowed: true;
  llmConfig: BentoLLMConfig;
  plan: UserPlan;
  source: "self-host" | "byok" | "credits";
  transaction: CreditTransactionRecord | null;
  refund: () => void;
}

export type AiGateResult = AiGatePass | NextResponse;

export interface OptionalAiGatePass extends Omit<AiGatePass, "llmConfig"> {
  llmConfig: BentoLLMConfig | null;
}

export type OptionalAiGateResult = OptionalAiGatePass | NextResponse;

export function gateAiFeature(
  userId: string,
  feature: CreditFeature,
  refId: string,
): Promise<AiGateResult> {
  return gateAiFeatureAsync(userId, feature, refId);
}

async function gateAiFeatureAsync(
  userId: string,
  feature: CreditFeature,
  refId: string,
): Promise<AiGateResult> {
  const llmConfig = await getBentoLLMConfig(userId);
  const plan = getUserPlan(userId);

  if (plan === "self-host") {
    if (!llmConfig) return missingProviderResponse();
    return pass(llmConfig, plan, "self-host", null);
  }

  if (llmConfig?.apiKey) {
    return pass(llmConfig, plan, "byok", null);
  }

  if (plan === "pro-monthly" || plan === "pro-weekly") {
    const transaction = deductCredits(userId, feature, refId);
    const hostedConfig = getHostedLLMConfig();
    return pass(hostedConfig, plan, "credits", transaction);
  }

  return NextResponse.json(
    {
      error: "AI tools require your own API key or a Pro plan.",
      code: "billing_required",
      plan,
    },
    { status: 402 },
  );
}

export function gateOptionalAiFeature(
  userId: string,
  feature: CreditFeature,
  refId: string,
): Promise<OptionalAiGateResult> {
  return gateOptionalAiFeatureAsync(userId, feature, refId);
}

async function gateOptionalAiFeatureAsync(
  userId: string,
  feature: CreditFeature,
  refId: string,
): Promise<OptionalAiGateResult> {
  const llmConfig = await getBentoLLMConfig(userId);
  const plan = getUserPlan(userId);

  if (plan === "self-host") {
    return optionalPass(llmConfig, plan, "self-host", null);
  }

  if (llmConfig?.apiKey) {
    return optionalPass(llmConfig, plan, "byok", null);
  }

  if (plan === "pro-monthly" || plan === "pro-weekly") {
    const transaction = deductCredits(userId, feature, refId);
    return optionalPass(getHostedLLMConfig(), plan, "credits", transaction);
  }

  return NextResponse.json(
    {
      error: "AI tools require your own API key or a Pro plan.",
      code: "billing_required",
      plan,
    },
    { status: 402 },
  );
}

export function isAiGateResponse(
  result: AiGateResult | OptionalAiGateResult,
): result is NextResponse {
  return result instanceof NextResponse;
}

function pass(
  llmConfig: BentoLLMConfig,
  plan: UserPlan,
  source: AiGatePass["source"],
  transaction: CreditTransactionRecord | null,
): AiGatePass {
  return {
    allowed: true,
    llmConfig,
    plan,
    source,
    transaction,
    refund() {
      if (transaction?.feature && transaction.refId) {
        refundCredits(
          transaction.userId,
          transaction.feature,
          transaction.refId,
        );
      }
    },
  };
}

function optionalPass(
  llmConfig: BentoLLMConfig | null,
  plan: UserPlan,
  source: AiGatePass["source"],
  transaction: CreditTransactionRecord | null,
): OptionalAiGatePass {
  return {
    allowed: true,
    llmConfig,
    plan,
    source,
    transaction,
    refund() {
      if (transaction?.feature && transaction.refId) {
        refundCredits(
          transaction.userId,
          transaction.feature,
          transaction.refId,
        );
      }
    },
  };
}

function missingProviderResponse() {
  return NextResponse.json(
    { error: "No LLM provider configured. Go to Settings to set one up." },
    { status: 400 },
  );
}

async function getBentoLLMConfig(
  userId: string,
): Promise<BentoLLMConfig | null> {
  const testLegacyConfig = getLegacyLLMConfigForTests(userId);
  try {
    await migrateLegacyLLMSettingsForUser(userId);
    const client = await getBentoRouterClient();
    const providers = await client.api(userId).listConfiguredProviders(userId);
    if (providers.length === 0) return null;
    return {
      userId,
      provider: "openrouter",
      model: "bentorouter",
      apiKey: "configured",
    };
  } catch (error) {
    if (process.env.NODE_ENV === "test") {
      return testLegacyConfig;
    }
    throw error;
  }
}

function getHostedLLMConfig(): BentoLLMConfig {
  if (!process.env.SLOTHING_HOSTED_LLM_API_KEY) {
    throw new Error(
      "SLOTHING_HOSTED_LLM_API_KEY is required for hosted Pro credit usage.",
    );
  }

  return {
    userId: "default",
    provider: "openrouter",
    model: "bentorouter-hosted",
    apiKey: "hosted",
  };
}

function getLegacyLLMConfigForTests(userId: string): BentoLLMConfig | null {
  if (process.env.NODE_ENV !== "test") return null;
  if (
    !("getLLMConfig" in dbModule) ||
    typeof dbModule.getLLMConfig !== "function"
  ) {
    return null;
  }
  let legacy;
  try {
    legacy = dbModule.getLLMConfig(userId);
  } catch {
    return null;
  }
  if (!legacy) return null;
  if (legacy.provider !== "ollama" && !legacy.apiKey) return null;
  return { ...legacy, userId };
}
