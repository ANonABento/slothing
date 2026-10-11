"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { CreditCard, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type BillingPlan = "pro_weekly" | "pro_monthly";

interface CheckoutButtonProps {
  plan: BillingPlan;
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
}

interface PortalButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
}

async function postForUrl(endpoint: string, body?: unknown): Promise<string> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await response.json().catch(() => ({}))) as {
    url?: string;
    error?: string;
  };
  if (!response.ok || !data.url) {
    throw new Error(data.error ?? "Billing is unavailable right now.");
  }
  return data.url;
}

export function CheckoutButton({
  plan,
  children,
  className,
  variant = "default",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");
    try {
      window.location.assign(
        await postForUrl("/api/billing/checkout", { plan }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Billing is unavailable.");
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <Button
        type="button"
        className="w-full"
        variant={variant}
        disabled={loading}
        onClick={() => void handleClick()}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CreditCard className="mr-2 h-4 w-4" />
        )}
        {children}
      </Button>
      {error && (
        <p className="mt-2 text-center text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function PortalButton({
  children = "Manage subscription",
  className,
  variant = "outline",
}: PortalButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");
    try {
      window.location.assign(await postForUrl("/api/billing/portal"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Billing is unavailable.");
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <Button
        type="button"
        className="w-full"
        variant={variant}
        disabled={loading}
        onClick={() => void handleClick()}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CreditCard className="mr-2 h-4 w-4" />
        )}
        {children}
      </Button>
      {error && (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
