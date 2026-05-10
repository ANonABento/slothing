import { NextResponse } from "next/server";
import { auth, isNextAuthConfigured } from "@/auth";
import { isOwner } from "@/lib/admin/owner";
import { buildDashboardPayload } from "@/lib/admin/evals/aggregate";
import { loadComparisonReports } from "@/lib/admin/evals/loader";
import { SAMPLE_COMPARISON_REPORTS } from "@/lib/admin/evals/sample-data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const session = await auth();

  if (isNextAuthConfigured() && !session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isOwner(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const reports = loadComparisonReports();
  const source = reports.length > 0 ? "reports" : "sample";

  return NextResponse.json(
    buildDashboardPayload(
      reports.length > 0 ? reports : SAMPLE_COMPARISON_REPORTS,
      { source },
    ),
  );
}
