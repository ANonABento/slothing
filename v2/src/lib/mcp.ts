import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

import * as db from "./db";
import { addJob, summary } from "./extension";
import { tailorJob, saveAgentLetter, writeLetter } from "./tailor-job";
import { CoverLetter, JOB_STATUSES, TailoredResume } from "./types";

/* ─── MCP: Slothing for agents (Claude Code, Codex, Cursor…) ───
 * Served at /api/mcp with the extension's key. Every tool reuses what the app and the extension already
 * do. An agent can tailor with Slothing's own AI, or write a draft with its own model and save it:
 * either way it goes through the same fitter and grounding as every other resume. No deleting, no
 * submitting applications.
 */

type Out = { content: { type: "text"; text: string }[]; isError?: boolean };

const json = (data: unknown): Out => ({ content: [{ type: "text", text: JSON.stringify(data, null, 2) }] });

/** Errors go back to the agent as text it can act on ("Job not found"), not as a protocol failure. */
const run = async (fn: () => unknown): Promise<Out> => {
  try {
    return json(await fn());
  } catch (e) {
    const message = e instanceof z.ZodError ? `Invalid input: ${e.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}` : e instanceof Error ? e.message : String(e);
    return { content: [{ type: "text", text: message }], isError: true };
  }
};

const needJob = (id: string) => {
  const job = db.getJob(id);
  if (!job) throw new Error(`No job with id ${id}. list_jobs gives the ids.`);
  return job;
};

// Plain shapes for drafts (no preprocessing, so they convert to JSON Schema), parsed with the app's schemas.
const Bullet = z.object({ text: z.string(), sourceIds: z.array(z.string()).describe("Ids of the profile bullets this one is based on") });
const Entry = z.object({ sourceId: z.string().describe("The profile entry's id"), bullets: z.array(Bullet) });
const ResumeDraft = z.object({
  summary: z.string(),
  experience: z.array(Entry),
  projects: z.array(Entry).optional(),
  extras: z.array(Entry).optional().describe("Entries from the profile's other sections, by entry id"),
  educationIds: z.array(z.string()).optional().describe("The profile education entries to show; leave out for all of them"),
  skills: z.array(z.object({ category: z.string(), items: z.array(z.string()) })),
});
const LetterDraft = z.object({ greeting: z.string(), paragraphs: z.array(z.string()), closing: z.string() });
const agent = z.string().optional().describe("Your name as an agent, shown as the draft's author (e.g. \"Claude Code\")");

const READ = { readOnlyHint: true, destructiveHint: false };
const WRITE = { readOnlyHint: false, destructiveHint: false };

export function buildServer(): McpServer {
  const server = new McpServer({ name: "slothing", version: "2.0.0" });

  server.registerTool(
    "get_profile",
    { description: "The user's profile: contact, summary, experience, projects, education, skills. Every resume is built only from this.", annotations: READ },
    () => run(() => db.getProfile()),
  );

  server.registerTool(
    "list_jobs",
    {
      description: "The user's jobs, newest activity first: id, title, company, status, fit, whether a resume and letter exist, when applied and when a follow-up is due.",
      inputSchema: z.object({ status: z.enum(JOB_STATUSES).optional().describe("Only jobs with this status") }),
      annotations: READ,
    },
    ({ status }) =>
      run(() =>
        db
          .listJobs()
          .filter((j) => !status || j.status === status)
          .map((j) => ({ ...summary(j), location: j.location, url: j.url, followUpAt: j.followUpAt })),
      ),
  );

  server.registerTool(
    "get_job",
    {
      description: "One job in full: the posting, notes, fit, the tailored resume and letter with their warnings, applications, status history, and the PDF paths (on the Slothing server).",
      inputSchema: z.object({ id: z.string() }),
      annotations: READ,
    },
    ({ id }) =>
      run(() => {
        const job = needJob(id);
        const resume = db.getDoc(id, "resume");
        const letter = db.getDoc(id, "cover_letter");
        return {
          ...job,
          fit: summary(job).fit,
          resume: resume && { draft: resume.data, warnings: resume.warnings, pdf: `/api/pdf?kind=resume&job=${id}` },
          letter: letter && { draft: letter.data, warnings: letter.warnings, pdf: `/api/pdf?kind=letter&job=${id}` },
          applications: db.listApplications(id),
          history: db.listEvents(id),
        };
      }),
  );

  server.registerTool(
    "add_job",
    {
      description: "Add a job from its posting link, a pasted description, or both. A posting already saved is returned instead of added twice.",
      inputSchema: z.object({ url: z.string().optional(), description: z.string().optional(), company: z.string().optional(), title: z.string().optional() }),
      annotations: WRITE,
    },
    (input) => run(async () => summary(needJob(await addJob(input)))),
  );

  server.registerTool(
    "set_status",
    {
      description: "Set a job's status, e.g. when the user hears back (interviewing, offer, rejected). Applied sets a follow-up a week out; any later status clears it.",
      inputSchema: z.object({ id: z.string(), status: z.enum(JOB_STATUSES) }),
      annotations: WRITE,
    },
    ({ id, status }) =>
      run(() => {
        needJob(id);
        db.setJobStatus(id, status);
        return summary(needJob(id));
      }),
  );

  server.registerTool(
    "tailor_resume",
    {
      description: "Tailor this job's resume with Slothing's own AI (ai: true, needs a model set up in Slothing) or by relevance without AI (ai: false). Returns what to check before sending.",
      inputSchema: z.object({ id: z.string(), ai: z.boolean() }),
      annotations: WRITE,
    },
    ({ id, ai }) => run(async () => ({ warnings: await tailorJob(needJob(id).id, ai) })),
  );

  server.registerTool(
    "save_resume",
    {
      description:
        "Save a resume you wrote with your own model. Use only the profile (get_profile): every entry and bullet cites the profile ids it comes from (sourceId, sourceIds). " +
        "Slothing then fits it to the page length set in Slothing (it may add more of the profile's bullets by relevance, or trim) and checks it against the profile: " +
          "bullets with no source are dropped, skills not in the profile are removed, and anything else it can't trace is flagged. Returns those warnings.",
      inputSchema: z.object({ id: z.string(), resume: ResumeDraft, agent }),
      annotations: WRITE,
    },
    ({ id, resume, agent }) =>
      run(async () => {
        // Agents often leave out what they didn't change: no projects or extras, and every degree.
        const educationIds = resume.educationIds ?? db.getProfile().education.map((e) => e.id);
        const doc = TailoredResume.parse({ ...resume, educationIds });
        return { warnings: await tailorJob(needJob(id).id, true, { doc, by: agent || "Your agent" }) };
      }),
  );

  server.registerTool(
    "write_letter",
    {
      description: "Write this job's cover letter with Slothing's own AI (needs a model set up in Slothing). Returns what to check before sending.",
      inputSchema: z.object({ id: z.string() }),
      annotations: WRITE,
    },
    ({ id }) =>
      run(async () => {
        await writeLetter(needJob(id).id);
        return { warnings: db.getDoc(id, "cover_letter")?.warnings ?? [] };
      }),
  );

  server.registerTool(
    "save_letter",
    {
      description: "Save a cover letter you wrote with your own model. Claims must come from the profile; numbers and posting wording it can't trace to the profile are flagged. Returns those warnings.",
      inputSchema: z.object({ id: z.string(), letter: LetterDraft, agent }),
      annotations: WRITE,
    },
    ({ id, letter, agent }) => run(() => ({ warnings: saveAgentLetter(needJob(id).id, CoverLetter.parse(letter), agent || "Your agent") })),
  );

  return server;
}
