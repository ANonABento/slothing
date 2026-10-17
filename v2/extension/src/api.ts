import type { AnswerProposal, Fill, FormField, Skip } from "@/lib/autofill";
import type { JobSummary } from "@/lib/extension";
import type { DraftAnswer } from "@/lib/tailor";
import type { Settings } from "@/lib/types";
import type { PageApi, PageFill } from "./page";

/* ─── Talking to Slothing (the app on localhost) and to the open tab ─── */

export interface Connection {
  server: string;
  key: string;
}

export async function getConnection(): Promise<Connection | null> {
  const { connection } = (await chrome.storage.local.get("connection")) as { connection?: Connection };
  return connection?.server && connection?.key ? connection : null;
}

export const setConnection = (c: Connection | null) => (c ? chrome.storage.local.set({ connection: c }) : chrome.storage.local.remove("connection"));

/**
 * "http://localhost:3001#key" (what the Extension page's Copy button gives you), or a bare address
 * plus the key pasted separately.
 */
export function parseConnection(text: string): Connection | null {
  const m = text.trim().match(/^(https?:\/\/[^\s#/]+)\/?#([\w-]{16,})$/);
  return m ? { server: m[1], key: m[2] } : null;
}

export interface Status {
  autoSave: boolean;
  profile: { name: string; ready: boolean };
  job: JobSummary | null;
  recent: JobSummary[];
  answers: number;
  llm: boolean;
  theme: Settings["appearance"];
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly unauthorized = false,
  ) {
    super(message);
  }
}

async function call<T>(c: Connection, op: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${c.server}/api/extension/${op}`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-slothing-key": c.key, "x-slothing-version": __VERSION__ },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(`Can't reach Slothing at ${c.server}. Is it running?`);
  }
  const json = await res.json().catch(() => null);
  if (!json?.ok) throw new ApiError(json?.error ?? `Slothing answered ${res.status}.`, res.status === 401);
  return json.data as T;
}

export const api = {
  /** `jobId`: the job this tab was applying for, when the page's link doesn't say. */
  status: (c: Connection, url: string, jobId?: string) => call<Status>(c, "status", { url, jobId }),
  seen: (c: Connection, page: { url: string; title: string; html: string; text: string }) => call<{ job: JobSummary | null; before: string | null }>(c, "seen", page),
  tailor: (c: Connection, jobId: string, ai: boolean) => call<{ job: JobSummary }>(c, "tailor", { jobId, ai }),
  letter: (c: Connection, jobId: string) => call<{ job: JobSummary }>(c, "letter", { jobId }),
  applied: (c: Connection, a: { jobId: string; url: string; fields: FormField[] }) => call<{ job: JobSummary }>(c, "applied", a),
  saveJob: (c: Connection, page: { url: string; html: string; text: string }) => call<{ job: JobSummary; created: boolean }>(c, "job", page),
  fill: (c: Connection, jobId: string | undefined, fields: FormField[]) => call<{ fills: Fill[]; skipped: Skip[] }>(c, "fill", { jobId, fields }),
  draft: (c: Connection, jobId: string | undefined, questions: { id: string; question: string; long: boolean }[]) =>
    call<{ drafts: DraftAnswer[] }>(c, "draft", { jobId, questions }),
  propose: (c: Connection, fields: FormField[]) => call<{ proposals: AnswerProposal[] }>(c, "propose", { fields }),
  saveAnswers: (c: Connection, url: string, answers: { question: string; answer: string; replaces?: string }[]) => call<{ saved: number }>(c, "answers", { url, answers }),
};

/** A job's tailored PDF, ready to attach to a file input. */
export async function fetchPdf(c: Connection, jobId: string, doc: "resume" | "letter"): Promise<{ name: string; base64: string }> {
  const res = await fetch(`${c.server}/api/pdf?kind=${doc}&job=${encodeURIComponent(jobId)}&download=1`).catch(() => null);
  if (!res?.ok) throw new ApiError(`Couldn't render the ${doc === "letter" ? "cover letter" : "resume"} PDF.`);
  const disposition = res.headers.get("content-disposition") ?? "";
  const utf8 = disposition.match(/filename\*=UTF-8''([^;]+)/)?.[1];
  const name = utf8 ? decodeURIComponent(utf8) : (disposition.match(/filename="([^"]+)"/)?.[1] ?? `${doc}.pdf`);
  const bytes = new Uint8Array(await res.arrayBuffer());
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return { name, base64: btoa(bin) };
}

/* ─── The open tab ───
 * Field ids from the page are per frame, so the popup prefixes them with the frame ("0:12").
 */

export interface Tab {
  id: number;
  url: string;
  title: string;
}

export async function activeTab(): Promise<Tab | null> {
  // Opened as a page for testing (popup.html?tab=123), act on that tab instead of this one.
  const forced = Number(new URLSearchParams(location.search).get("tab"));
  const [tab] = forced ? [await chrome.tabs.get(forced)] : await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.id && tab.url ? { id: tab.id, url: tab.url, title: tab.title ?? "" } : null;
}

type Op = keyof PageApi;
type Out<K extends Op> = Awaited<ReturnType<PageApi[K]>>;

/** Inject the page script and run one of its functions in every frame we can reach (or only `frameIds`). */
export async function inPage<K extends Op>(tab: Tab, op: K, arg?: Parameters<PageApi[K]>[0], frameIds?: number[]): Promise<{ frameId: number; result: Out<K> }[]> {
  const target = frameIds ? { tabId: tab.id, frameIds } : { tabId: tab.id, allFrames: true };
  await chrome.scripting.executeScript({ target, files: ["page.js"] });
  const results = await chrome.scripting.executeScript({
    target,
    func: (o: string, a: unknown) => (globalThis as unknown as Record<string, Record<string, (x: unknown) => unknown>>).__slothing[o](a),
    args: [op, arg ?? null],
  });
  return results.filter((r) => r.result !== undefined && r.result !== null).map((r) => ({ frameId: r.frameId, result: r.result as Out<K> }));
}

export interface PageForm {
  fields: FormField[];
  combos: number;
  /** Frames from other sites that couldn't be read without more access. */
  blockedFrames: number;
}

export async function readForm(tab: Tab): Promise<PageForm> {
  const frames = await inPage(tab, "read");
  const fields = frames.flatMap(({ frameId, result }) => result.fields.map((f) => ({ ...f, id: `${frameId}:${f.id}` })));
  const readable = frames.length;
  const embedded = frames.reduce((n, f) => n + f.result.frames, 0);
  return { fields, combos: frames.reduce((n, f) => n + f.result.combos, 0), blockedFrames: Math.max(0, embedded - (readable - 1)) };
}

const split = (id: string) => {
  const i = id.indexOf(":");
  return { frameId: Number(id.slice(0, i)), id: id.slice(i + 1) };
};

export async function fillPage(tab: Tab, fills: (PageFill & { id: string })[]): Promise<string[]> {
  const byFrame = new Map<number, PageFill[]>();
  for (const f of fills) {
    const { frameId, id } = split(f.id);
    byFrame.set(frameId, [...(byFrame.get(frameId) ?? []), { ...f, id }]);
  }
  const done: string[] = [];
  for (const [frameId, list] of byFrame) {
    const [r] = await inPage(tab, "fill", list, [frameId]);
    done.push(...(r?.result ?? []).map((id) => `${frameId}:${id}`));
  }
  return done;
}

export async function revealField(tab: Tab, fieldId: string) {
  const { frameId, id } = split(fieldId);
  await inPage(tab, "reveal", id, [frameId]);
}

export async function readPosting(tab: Tab) {
  const [top] = await inPage(tab, "posting", undefined, [0]);
  if (!top) throw new ApiError("Couldn't read this page.");
  return top.result;
}
