import { NextResponse } from "next/server";

import { isAuthError, requireAuth } from "@/lib/auth";
import { getCreditBalance, getCreditTransactions } from "@/lib/db/credits";

export async function GET() {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  return NextResponse.json({
    balance: await getCreditBalance(authResult.userId),
    transactions: await getCreditTransactions(authResult.userId, 30),
  });
}
