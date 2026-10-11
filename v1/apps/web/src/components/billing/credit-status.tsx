"use client";

import { useEffect, useState } from "react";
import { Coins, RefreshCw } from "lucide-react";

import { formatDateOnly } from "@/lib/format/time";
import { cn } from "@/lib/utils";

interface CreditBalance {
  balance: number;
  updatedAt: string;
}

interface CreditTransaction {
  id: string;
  delta: number;
  reason: string;
  feature: string | null;
  refId: string | null;
  createdAt: string;
}

interface CreditsResponse {
  balance: CreditBalance;
  transactions: CreditTransaction[];
}

function isHostedBillingEnabled() {
  return Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

export function CreditBalanceBadge({ collapsed }: { collapsed?: boolean }) {
  const { data, loading } = useCredits();
  if (!isHostedBillingEnabled()) return null;

  const balance = data?.balance.balance ?? 0;
  return (
    <div
      className={cn(
        "rounded-lg border bg-card px-3 py-2 text-sm",
        collapsed && "flex justify-center px-2",
      )}
      title={`${balance} Slothing credits`}
    >
      <div className="flex items-center gap-2">
        <Coins className="h-4 w-4 text-primary" aria-hidden="true" />
        {!collapsed && (
          <span className="min-w-0 truncate font-medium">
            {loading ? "Credits..." : `${balance} credits`}
          </span>
        )}
      </div>
    </div>
  );
}

export function CreditHistory() {
  const { data, loading, error, refresh } = useCredits();
  if (!isHostedBillingEnabled()) return null;

  return (
    <section className="rounded-lg border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold">Credits</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your hosted Pro balance and the last 30 credit ledger entries.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Refresh credit balance"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </button>
      </div>

      <div className="mt-4 rounded-lg border bg-background p-4">
        <div className="text-2xl font-semibold">
          {data?.balance.balance ?? 0}
        </div>
        <div className="text-sm text-muted-foreground">available credits</div>
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <div className="mt-4 divide-y rounded-lg border">
        {(data?.transactions ?? []).length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            No credit activity yet.
          </div>
        ) : (
          data?.transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between gap-4 p-3 text-sm"
            >
              <div className="min-w-0">
                <div className="font-medium capitalize">
                  {formatReason(transaction)}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {formatDateOnly(transaction.createdAt)}
                </div>
              </div>
              <div
                className={cn(
                  "shrink-0 font-semibold",
                  transaction.delta >= 0 ? "text-success" : "text-foreground",
                )}
              >
                {transaction.delta >= 0 ? "+" : ""}
                {transaction.delta}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function useCredits() {
  const [data, setData] = useState<CreditsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!isHostedBillingEnabled()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/billing/credits");
      if (!response.ok) throw new Error("Could not load credit balance");
      setData((await response.json()) as CreditsResponse);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load credits",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { data, loading, error, refresh };
}

function formatReason(transaction: CreditTransaction) {
  if (transaction.reason === "invoice_paid") return "Plan credits";
  if (transaction.reason === "usage" && transaction.feature) {
    return transaction.feature.replaceAll("_", " ");
  }
  return transaction.reason.replaceAll("_", " ");
}
