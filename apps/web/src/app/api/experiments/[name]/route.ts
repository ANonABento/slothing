/**
 * @route GET /api/experiments/[name]
 * @description Resolve the calling user's variant for a registered experiment
 *   and log an exposure event. Called by the extension when it renders an
 *   experiment-gated surface. `name` is the registry key (e.g. `profilePicker`).
 *   The extension should fetch once per relevant page and cache the result to
 *   avoid inflating exposure counts.
 * @auth Extension token
 * @response { name, variant }
 */
import { NextRequest, NextResponse } from "next/server";
import { requireExtensionAuth } from "@/lib/extension-auth";
import {
  EXPERIMENTS,
  getVariant,
  type ExperimentName,
} from "@/lib/experiments";
import { trackExposure } from "@/lib/experiments/track";

export const dynamic = "force-dynamic";

function isExperimentName(value: string): value is ExperimentName {
  return Object.prototype.hasOwnProperty.call(EXPERIMENTS, value);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } },
) {
  const authResult = await requireExtensionAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  const { name } = params;
  if (!isExperimentName(name)) {
    return NextResponse.json(
      { error: `Unknown experiment "${name}"` },
      { status: 404 },
    );
  }

  const variant = getVariant(name, authResult.userId);

  // Exposure logging is best-effort — never block the assignment on telemetry.
  try {
    await trackExposure(EXPERIMENTS[name].key, variant, authResult.userId);
  } catch (error) {
    console.error("Experiment exposure logging failed:", error);
  }

  return NextResponse.json({ name, variant });
}
