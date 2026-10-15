"use client";

import { AlertTriangle, Check, Loader2, Plug, Settings2 } from "lucide-react";
import { useState, useTransition, type ReactNode } from "react";

import { saveSettingsAction, testLlmAction } from "@/app/actions";
import type { ProviderStatus } from "@/lib/llm";
import { safe } from "@/lib/safe";
import type { Provider, Settings } from "@/lib/types";
import { Dropdown } from "./dropdown";
import { PageBody, PageHeader } from "./page-header";
import { SaveBar } from "./save-bar";
import { Button, Card, CardTitle, Field, Input } from "./ui";

function Section({ title, description, children }: { title: string; description: ReactNode; children: ReactNode }) {
  return (
    <Card className="p-5">
      <CardTitle>{title}</CardTitle>
      <p className="mb-4 mt-0.5 text-sm text-ink-2">{description}</p>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}

type Test = { state: "idle" } | { state: "running" } | { state: "ok"; text: string } | { state: "error"; text: string };

function ModelSection({ ai, providers, onChange }: { ai: Settings["ai"]; providers: ProviderStatus[]; onChange: (ai: Settings["ai"]) => void }) {
  const [test, setTest] = useState<Test>({ state: "idle" });
  const chosen = ai.provider ? providers.find((p) => p.provider === ai.provider)! : null;
  const fallback = providers.find((p) => p.hasKey);
  const withKey = providers.filter((p) => p.hasKey);
  const withoutKey = providers.filter((p) => !p.hasKey);
  // The provider that will actually be called, so the model field edits the right one.
  const active = chosen?.hasKey ? chosen : fallback;

  const update = (next: Settings["ai"]) => {
    onChange(next);
    setTest({ state: "idle" });
  };

  const runTest = async () => {
    setTest({ state: "running" });
    const res = await safe(() => testLlmAction(ai));
    if (res.ok && res.data) setTest({ state: "ok", text: `${res.data.provider} · ${res.data.model} answered in ${(res.data.ms / 1000).toFixed(1)}s` });
    else setTest({ state: "error", text: res.ok ? "No answer." : res.error });
  };

  const options = [
    { value: "auto" as const, label: `Automatic${fallback ? ` (${fallback.label})` : ""}`, text: "Automatic" },
    ...providers.map((p) => ({ value: p.provider, label: p.hasKey ? p.label : `${p.label} · no key`, text: p.label })),
  ];

  return (
    <Section title="AI model" description="Used for importing resumes, reading job posts, tailoring and cover letters. API keys stay in v2/.env.local.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Provider">
          <Dropdown
            label="Provider"
            value={ai.provider ?? "auto"}
            onChange={(v) => update({ ...ai, provider: v === "auto" ? null : (v as Provider) })}
            options={options}
          />
        </Field>
        {active && (
          <Field label={`${active.label} model`}>
            <Input
              value={ai.models[active.provider]}
              onChange={(e) => update({ ...ai, models: { ...ai.models, [active.provider]: e.target.value } })}
              placeholder={active.defaultModel}
              spellCheck={false}
            />
          </Field>
        )}
      </div>

      {active?.provider === "openai" && (
        <Field label="Endpoint (OpenAI-compatible)">
          <Input value={ai.openaiBaseUrl} onChange={(e) => update({ ...ai, openaiBaseUrl: e.target.value })} placeholder={active.defaultBase} spellCheck={false} />
        </Field>
      )}

      {chosen && !chosen.hasKey && (
        <p className="flex items-start gap-2 text-sm text-warn">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {chosen.keyEnv} isn&apos;t set{fallback ? `, so ${fallback.label} is used until you add it` : ""}.
          </span>
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-rule pt-4">
        <Button size="sm" onClick={runTest} disabled={!active || test.state === "running"}>
          {test.state === "running" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plug className="h-3.5 w-3.5" />} Test connection
        </Button>
        {test.state === "ok" && <span className="inline-flex items-center gap-1 text-sm text-ok"><Check className="h-4 w-4" />{test.text}</span>}
        {test.state === "error" && <span className="text-sm text-warn">{test.text}</span>}
        {test.state === "idle" && (
          <span className="text-xs text-ink-3">
            {withKey.length ? `Key found for ${withKey.map((p) => p.label).join(", ")}.` : "No API keys found."}
            {withoutKey.length > 0 && ` Add ${withoutKey.map((p) => p.keyEnv).join(" or ")} to use ${withoutKey.length > 1 ? "the others" : withoutKey[0].label}.`}
          </span>
        )}
      </div>
    </Section>
  );
}

export function SettingsEditor({ initial, providers }: { initial: Settings; providers: ProviderStatus[] }) {
  const [s, setS] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(s) !== JSON.stringify(saved);

  const save = () =>
    start(async () => {
      setError("");
      const res = await safe(() => saveSettingsAction(s));
      if (res.ok) setSaved(s);
      else setError(res.error);
    });

  return (
    <>
      <PageHeader
        icon={Settings2}
        title="Settings"
        description="Which model to use and how much it may change your resume."
        actions={
          <>
            {dirty ? <span className="text-xs text-ink-3">Unsaved changes</span> : <span className="inline-flex items-center gap-1 text-xs text-ok"><Check className="h-3.5 w-3.5" />Saved</span>}
            <Button variant="primary" onClick={save} disabled={pending || !dirty}>{pending ? "Saving…" : "Save settings"}</Button>
          </>
        }
      />
      <PageBody>
        <div className="max-w-3xl space-y-4">
          {error && <p className="text-sm text-warn">{error}</p>}
          <ModelSection ai={s.ai} providers={providers} onChange={(ai) => setS({ ...s, ai })} />
          <SaveBar dirty={dirty} pending={pending} onSave={save} onDiscard={() => setS(saved)} label="Save settings" />
        </div>
      </PageBody>
    </>
  );
}
