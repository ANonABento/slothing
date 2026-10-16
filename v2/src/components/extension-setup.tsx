"use client";

import { Check, Copy, MessageSquareText, Plus, Puzzle, RotateCcw, Wand2 } from "lucide-react";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { resetExtensionKeyAction } from "@/app/actions";
import { ago } from "@/lib/format";
import { safe } from "@/lib/safe";
import { useConfirm } from "./confirm";
import { PageBody, PageHeader } from "./page-header";
import { Button, Card, CardTitle, Eyebrow, IconButton, cx } from "./ui";

/** What the extension's content script said about itself on this page (see extension/src/pair.ts). */
type Detected = { version: string; connectedTo: string | null } | null;

function CopyText({ text, label, children }: { text: string; label: string; children?: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <div className="flex min-w-0 items-center gap-1 rounded-control border border-rule bg-page py-1 pl-3 pr-1">
      <code className="min-w-0 flex-1 truncate font-mono text-xs text-ink-2">{children ?? text}</code>
      <IconButton size="sm" label={copied ? "Copied" : label} onClick={copy}>
        {copied ? <Check className="h-4 w-4 text-ok" /> : <Copy className="h-4 w-4" />}
      </IconButton>
    </div>
  );
}

function Step({ n, done, title, children }: { n: number; done: boolean; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className={cx("grid h-6 w-6 shrink-0 place-items-center rounded-chip font-mono text-xs", done ? "bg-ok-soft text-ok" : "bg-page-2 text-ink")}>{done ? "✓" : n}</span>
      <div className="min-w-0 flex-1 space-y-2 pt-0.5">
        <div className={cx("text-sm font-medium", done && "text-ink-2")}>{title}</div>
        {children}
      </div>
    </li>
  );
}

export function ExtensionSetup({ connectionKey, seen, dist, built }: { connectionKey: string; seen: { at: string; version: string } | null; dist: string; built: string | null }) {
  const [detected, setDetected] = useState<Detected>(null);
  const [looked, setLooked] = useState(false);
  // Set when the extension confirms a connect from this page. Otherwise a call since the last key reset proves it.
  const [linked, setLinked] = useState(false);
  const [origin, setOrigin] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const { confirm, dialog } = useConfirm();
  const asked = useRef(false);

  useEffect(() => {
    setOrigin(location.origin);
    const onMessage = (e: MessageEvent) => {
      if (e.source !== window || e.data?.type !== "slothing:extension") return;
      setDetected({ version: String(e.data.version), connectedTo: e.data.connectedTo ?? null });
      if (asked.current && e.data.connectedTo === location.origin) setLinked(true);
    };
    window.addEventListener("message", onMessage);
    window.postMessage({ type: "slothing:ping" }, location.origin);
    const t = setTimeout(() => setLooked(true), 800);
    return () => {
      window.removeEventListener("message", onMessage);
      clearTimeout(t);
    };
  }, []);

  const connected = detected?.connectedTo === origin && (Boolean(seen) || linked);
  const connect = () => {
    asked.current = true;
    window.postMessage({ type: "slothing:connect", key: connectionKey }, location.origin);
  };
  const reset = async () => {
    if (!(await confirm({ title: "Reset the key?", body: "The extension stops working until you connect it again. Do this if someone else got hold of your connection key.", confirmLabel: "Reset key" }))) return;
    start(async () => {
      const res = await safe(() => resetExtensionKeyAction());
      if (!res.ok) return setError(res.error);
      setLinked(false);
      asked.current = false;
    });
  };

  return (
    <>
      {dialog}
      <PageHeader icon={Puzzle} title="Extension" description="Save postings and fill applications from your browser, with your profile and answer bank." />
      <PageBody>
        <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <Card className="p-5">
            <Eyebrow className="mb-1">Set up · Chrome</Eyebrow>
            <CardTitle className="mb-4">Install it once</CardTitle>
            <ol className="space-y-5">
              <Step n={1} done={Boolean(built)} title={built ? `Built (version ${built})` : "Build it"}>
                <p className="text-sm text-ink-2">In <code className="font-mono text-xs">v2/</code>, run this. Run it again after pulling changes, then reload the extension.</p>
                <CopyText text="npm run extension" label="Copy command" />
              </Step>
              <Step n={2} done={Boolean(detected)} title={detected ? `Installed (version ${detected.version})` : "Load it in Chrome"}>
                <p className="text-sm text-ink-2">
                  Open <code className="font-mono text-xs">chrome://extensions</code>, turn on <span className="font-medium text-ink">Developer mode</span>, click{" "}
                  <span className="font-medium text-ink">Load unpacked</span> and choose this folder:
                </p>
                <CopyText text={dist} label="Copy folder path" />
                {!detected && looked && <p className="text-xs text-ink-3">Not seen on this page yet. After loading it, reload this page.</p>}
                {detected && built && detected.version !== built && <p className="text-xs text-warn">The installed version is older than the build. Reload it in chrome://extensions.</p>}
              </Step>
              <Step n={3} done={connected} title={connected ? "Connected" : "Connect it to this app"}>
                {connected ? (
                  <p className="text-sm text-ink-2">
                    {seen ? `Last used ${ago(seen.at).toLowerCase()}.` : "Ready."} Open a job posting or an application and click the Slothing icon (or press{" "}
                    <kbd className="rounded-chip border border-rule bg-page px-1 font-mono text-xs">Alt</kbd>+<kbd className="rounded-chip border border-rule bg-page px-1 font-mono text-xs">Shift</kbd>+<kbd className="rounded-chip border border-rule bg-page px-1 font-mono text-xs">S</kbd>).
                  </p>
                ) : (
                  <>
                    <Button variant="primary" onClick={connect} disabled={!detected}>Connect extension</Button>
                    <p className="text-xs text-ink-3">Or paste this connection key into the extension&apos;s popup (needed when the app isn&apos;t on localhost):</p>
                  </>
                )}
                {origin && (
                  <div className={cx(connected && "pt-1")}>
                    {connected && <p className="mb-1.5 text-xs text-ink-3">Connection key</p>}
                    <CopyText text={`${origin}#${connectionKey}`} label="Copy connection key">
                      {origin}#{"•".repeat(12)}
                    </CopyText>
                  </div>
                )}
                <Button variant="ghost" size="sm" onClick={reset} disabled={pending}>
                  <RotateCcw className="h-3.5 w-3.5" /> Reset key
                </Button>
                {error && <p className="text-sm text-warn">{error}</p>}
              </Step>
            </ol>
          </Card>

          <Card className="p-5">
            <Eyebrow className="mb-1">Using it</Eyebrow>
            <CardTitle className="mb-4">One button, three jobs</CardTitle>
            <ul className="space-y-4 text-sm">
              <Use icon={Plus} title="Save job">On a posting, saves its title, company and full description to Jobs. Works on pages behind a login and ones built with JavaScript (Workday), since it reads what you see.</Use>
              <Use icon={Wand2} title="Fill form">
                On an application: name, email, phone and links from your profile, other questions from your answer bank, and this job&apos;s tailored resume and cover letter attached as PDFs.
                Fields you filled are left alone, and nothing is ever submitted.
              </Use>
              <Use icon={MessageSquareText} title="Save my answers">After you answer new questions on a form, saves them to your answer bank, so the next form that asks gets them filled in.</Use>
            </ul>
            <p className="mt-5 border-t border-rule pt-4 text-xs leading-5 text-ink-3">
              The extension reads a page only when you click its button, and talks only to this app. Questions without a saved answer can be drafted by AI from your profile, on request.
            </p>
          </Card>
        </div>
      </PageBody>
    </>
  );
}

function Use({ icon: Icon, title, children }: { icon: typeof Plus; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-control border border-rule bg-page-2">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="font-medium">{title}</div>
        <p className="mt-0.5 leading-relaxed text-ink-2">{children}</p>
      </div>
    </li>
  );
}
