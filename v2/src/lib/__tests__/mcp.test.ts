import { createMcpHandler } from "@modelcontextprotocol/server";
import { describe, expect, it } from "vitest";

import { createJob, getDoc, listEvents, saveProfile } from "../db";
import { buildServer } from "../mcp";
import { profile } from "./fixture";

const handler = createMcpHandler(() => buildServer());
let n = 0;

async function call(method: string, params: unknown) {
  const res = await handler.fetch(
    new Request("http://localhost/api/mcp", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json, text/event-stream", "mcp-protocol-version": "2025-06-18" },
      body: JSON.stringify({ jsonrpc: "2.0", id: ++n, method, params }),
    }),
  );
  const text = await res.text();
  const line = text.split("\n").find((l) => l.startsWith("data: "));
  return JSON.parse(line ? line.slice(6) : text).result;
}

const tool = async (name: string, args: Record<string, unknown> = {}) => {
  const r = await call("tools/call", { name, arguments: args });
  return { isError: Boolean(r.isError), text: r.content[0].text as string };
};

describe("MCP server", () => {
  saveProfile(profile);
  const jobId = createJob({ company: "Globex", title: "Platform Engineer", url: "", location: "", description: "TypeScript, GraphQL and CI. GraphQL GraphQL CI CI." });

  it("lists its tools, none of them destructive", async () => {
    const { tools } = await call("tools/list", {});
    expect(tools.map((t: { name: string }) => t.name).sort()).toEqual(
      ["add_job", "get_job", "get_profile", "list_jobs", "save_letter", "save_resume", "set_status", "tailor_resume", "write_letter"].sort(),
    );
    expect(tools.every((t: { annotations?: { destructiveHint?: boolean } }) => t.annotations?.destructiveHint === false)).toBe(true);
  });

  it("an agent's resume goes through grounding: a bullet with no source and a skill not in the profile are removed", async () => {
    const exp = profile.experience[0];
    const r = await tool("save_resume", {
      id: jobId,
      agent: "Test Agent",
      resume: {
        summary: "Engineer.",
        experience: [{ sourceId: exp.id, bullets: [{ text: exp.bullets[0].text, sourceIds: [exp.bullets[0].id] }, { text: "Led 40 people at Google.", sourceIds: [] }] }],
        projects: [],
        extras: [],
        educationIds: [],
        skills: [{ category: "Languages", items: ["TypeScript", "Rust"] }],
      },
    });
    expect(r.isError).toBe(false);
    expect(r.text).toMatch(/Dropped a bullet with no source/);
    expect(r.text).toMatch(/Rust/);
    const doc = getDoc(jobId, "resume")!;
    expect(doc.meta).toEqual({ source: "ai", provider: "Test Agent" });
    expect(JSON.stringify(doc.data)).not.toContain("Google");
    expect(doc.data.skills.flatMap((g) => g.items)).not.toContain("Rust");
  });

  it("a draft may leave out projects, other sections and education: education then stays as in the profile", async () => {
    const exp = profile.experience[0];
    const r = await tool("save_resume", {
      id: jobId,
      resume: { summary: "", experience: [{ sourceId: exp.id, bullets: [{ text: exp.bullets[0].text, sourceIds: [exp.bullets[0].id] }] }], skills: [] },
    });
    expect(r.isError).toBe(false);
    expect(getDoc(jobId, "resume")!.data.educationIds).toEqual(profile.education.map((e) => e.id));
  });

  it("an agent's letter is checked like any letter", async () => {
    const r = await tool("save_letter", { id: jobId, letter: { greeting: "Hi,", paragraphs: ["I led 75 engineers."], closing: "Best," } });
    expect(r.text).toMatch(/75/);
    expect(getDoc(jobId, "cover_letter")?.meta.provider).toBe("Your agent");
  });

  it("set_status records the history; a wrong id is an error the agent can read", async () => {
    await tool("set_status", { id: jobId, status: "applied" });
    expect(listEvents(jobId).at(-1)).toMatchObject({ from: "saved", to: "applied" });
    const bad = await tool("get_job", { id: "nope" });
    expect(bad).toEqual({ isError: true, text: "No job with id nope. list_jobs gives the ids." });
  });
});
