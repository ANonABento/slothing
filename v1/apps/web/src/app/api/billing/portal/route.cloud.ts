import type { NextRequest } from "next/server";

import { createCustomerPortalSession } from "@/cloud/billing/handlers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function POST(request: NextRequest) {
  return createCustomerPortalSession(request);
}
