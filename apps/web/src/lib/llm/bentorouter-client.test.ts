import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createEmbeddedBentoRouterClient } from "./bentorouter-client";

describe("createEmbeddedBentoRouterClient", () => {
  it("keeps task policy overrides scoped by user", async () => {
    const rootDir = mkdtempSync(join(tmpdir(), "slothing-bento-router-"));
    const client = createEmbeddedBentoRouterClient({
      rootDir,
      env: { NEXTAUTH_SECRET: "test-secret-with-enough-entropy" },
    });

    await client.api("user-a").updateTaskPolicy("slothing.parse_resume", {
      primaryModel: "openrouter/openai/gpt-4o-mini",
    });
    await client.api("user-b").updateTaskPolicy("slothing.parse_resume", {
      primaryModel: "openrouter/google/gemini-flash",
    });

    const userATask = await client
      .api("user-a")
      .getTask("slothing.parse_resume");
    const userBTask = await client
      .api("user-b")
      .getTask("slothing.parse_resume");

    expect(userATask.effectivePolicy).toMatchObject({
      primaryModel: "openrouter/openai/gpt-4o-mini",
    });
    expect(userBTask.effectivePolicy).toMatchObject({
      primaryModel: "openrouter/google/gemini-flash",
    });
  });
});
