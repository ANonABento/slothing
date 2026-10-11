"use client";

import { useEffect, useState } from "react";
import { KeyRound, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageSection } from "@/components/ui/page-layout";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { TimeAgo } from "@/components/format/time-ago";
import { readJsonResponse } from "@/lib/http";

interface ServiceToken {
  id: string;
  label: string | null;
  tokenSuffix: string;
  createdAt: string | null;
  lastUsedAt: string | null;
  expiresAt: string;
}

export function ServiceTokensSection() {
  const { confirm, dialog } = useConfirmDialog();
  const [tokens, setTokens] = useState<ServiceToken[]>([]);
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [freshToken, setFreshToken] = useState<string | null>(null);

  const load = async () => {
    try {
      const response = await fetch("/api/agent/tokens");
      const data = await readJsonResponse<{ tokens: ServiceToken[] }>(
        response,
        "Failed to load service tokens",
      );
      setTokens(data.tokens);
    } catch {
      // Non-fatal: render the section empty rather than leaking an unhandled
      // rejection (the on-mount fetch is fire-and-forget via `void load()`).
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async () => {
    setCreating(true);
    setFreshToken(null);
    try {
      const response = await fetch("/api/agent/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
      });
      const data = await readJsonResponse<{ token: { token: string } }>(
        response,
        "Failed to create service token",
      );
      setFreshToken(data.token.token);
      setLabel("");
      await load();
    } finally {
      setCreating(false);
    }
  };

  const revoke = async (token: ServiceToken) => {
    const confirmed = await confirm({
      title: "Revoke this service token?",
      description: `Any agent using "${token.label ?? "this token"}" (…${token.tokenSuffix}) will immediately lose access. This cannot be undone.`,
      confirmLabel: "Revoke",
    });
    if (!confirmed) return;
    await fetch(`/api/agent/tokens/${token.id}`, { method: "DELETE" });
    await load();
  };

  return (
    <PageSection
      title="Service tokens"
      description="Long-lived tokens for an always-on agent or the hosted runner. Treat them like passwords."
      icon={KeyRound}
    >
      {dialog}

      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-0 flex-1">
          <Input
            placeholder="Label (e.g. overnight-agent)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            aria-label="Service token label"
          />
        </div>
        <Button type="button" onClick={() => void create()} disabled={creating}>
          {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate token
        </Button>
      </div>

      {freshToken && (
        <div className="mt-3 rounded-md border border-brand bg-brand-soft p-3">
          <p className="text-sm font-medium text-foreground">
            Copy this token now — it won&apos;t be shown again.
          </p>
          <code className="mt-1 block break-all font-mono text-xs text-ink">
            {freshToken}
          </code>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : tokens.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No service tokens yet.
          </p>
        ) : (
          tokens.map((token) => (
            <div
              key={token.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-card p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {token.label || "Untitled token"}{" "}
                  <span className="font-mono text-xs text-muted-foreground">
                    …{token.tokenSuffix}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Created <TimeAgo date={token.createdAt ?? token.expiresAt} />
                  {token.lastUsedAt ? (
                    <>
                      {" · last used "}
                      <TimeAgo date={token.lastUsedAt} />
                    </>
                  ) : (
                    " · never used"
                  )}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => void revoke(token)}
                aria-label={`Revoke ${token.label ?? "token"}`}
              >
                <Trash2 className="mr-1.5 h-4 w-4" /> Revoke
              </Button>
            </div>
          ))
        )}
      </div>
    </PageSection>
  );
}
