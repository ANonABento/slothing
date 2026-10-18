/**
 * A six-week job search on real postings, to check Insights by: `npm run seed -- <empty folder> [--app <url>]`.
 *
 * The postings are real (public Greenhouse boards, cached in the folder as postings.json). What happened to
 * each one is made up: 40 seen, 25 saved, 18 applied, 4 replies, 2 interviews, 1 offer, with follow-ups
 * sent, ghosted applications, a rejection after an interview, a job applied to twice and two saves either
 * side of this week's midnight. Every story states its milestones, so the counts are checked against
 * the plan, not against the counting code. `--check` checks a folder seeded before; `--app` also reads
 * the Jobs page of a server running on that folder.
 */
import Database from "better-sqlite3";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";

import { STAGES, weekStart, type Counts, type Stage } from "@/lib/insights";
import type { JobStatus } from "@/lib/types";

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--app");
const app = args.includes("--app") ? args[args.indexOf("--app") + 1] : null;
const checkOnly = args.includes("--check");
if (!dir) throw new Error("Usage: npm run seed -- <empty folder> [--app http://localhost:3000] [--check]");
const folder = resolve(dir);
if (folder === resolve("data")) throw new Error("Not the real data folder: give the seed its own.");
if (!checkOnly && existsSync(join(folder, "slothing.db"))) throw new Error(`${folder} already has a database. Use an empty folder, or --check.`);
mkdirSync(folder, { recursive: true });
process.env.SLOTHING_DATA_DIR = folder;

const DAY = 86_400_000;
const NOW = checkOnly ? new Date(JSON.parse(readFileSync(join(folder, "seed.json"), "utf8")).now) : new Date();

/* ─── Real postings ─── */

interface Posting {
  company: string;
  title: string;
  url: string;
  location: string;
  description: string;
}

// Boards with data or analytics analyst openings in October 2026; one that has closed them just adds none.
const BOARDS = ["stripe", "lyft", "okta", "mongodb", "brex", "block", "sezzle", "fivetran", "instacart", "elastic", "hellofresh", "cloudflare", "reddit", "robinhood", "figma", "chime", "datadog", "twilio", "oscar", "roblox", "justworks", "braze", "ripple", "seatgeek"];

async function fetchPostings(n: number): Promise<Posting[]> {
  const cache = join(folder, "postings.json");
  if (existsSync(cache)) return JSON.parse(readFileSync(cache, "utf8"));
  const { htmlToText } = await import("@/lib/job-import");
  const lists = await Promise.all(
    BOARDS.map(async (board) => {
      const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${board}/jobs`);
      const jobs = ((await res.json()) as { jobs: { id: number; title: string }[] }).jobs ?? [];
      // One person's search: data and analytics analyst roles, not every job with "analyst" in it.
      const titles = new Set<string>();
      return jobs
        .filter((j) => /\b(data|analytics|insights|product|business|marketing|growth|bi)\b.{0,20}analy/i.test(j.title))
        .filter((j) => !/director|head of|principal|vp\b|intern|manager|staff|lead\b|software|engineer|analyste/i.test(j.title))
        .filter((j) => !titles.has(j.title) && titles.add(j.title))
        .map((j) => ({ board, id: j.id }));
    }),
  );
  // Round-robin across boards, so the search spans companies like a real one.
  const picked: { board: string; id: number }[] = [];
  for (let i = 0; picked.length < n && lists.some((l) => l.length > i); i++) for (const l of lists) if (l[i] && picked.length < n) picked.push(l[i]);
  const postings = await Promise.all(
    picked.map(async ({ board, id }) => {
      const j = (await (await fetch(`https://boards-api.greenhouse.io/v1/boards/${board}/jobs/${id}`)).json()) as {
        title: string;
        company_name?: string;
        absolute_url: string;
        location?: { name?: string };
        content: string;
      };
      return { company: j.company_name || board, title: j.title, url: j.absolute_url, location: j.location?.name ?? "", description: htmlToText(j.content) };
    }),
  );
  if (postings.length < n) throw new Error(`Only ${postings.length} postings found; need ${n}.`);
  writeFileSync(cache, JSON.stringify(postings, null, 1));
  return postings;
}

/* ─── The search: what happened to each posting ─── */

/** `days` ago at `hour`:`min`, never later than now (a story "today" at 10:00 run at 2 am happens at 1:59). */
const at = (days: number, hour = 10, min = 0) => {
  const d = new Date(NOW);
  d.setDate(d.getDate() - days);
  d.setHours(hour, min, 0, 0);
  return new Date(Math.min(d.getTime(), NOW.getTime() - 60_000));
};
const WEEK = weekStart(NOW);

interface Story {
  label: string;
  steps: [JobStatus, Date][];
  applications: Date[];
  /** When a follow-up is due, or null for none. */
  followUp: Date | null;
  /** When it reached each stage: what the counts should say. */
  expect: Partial<Record<Stage, Date>>;
}

const story = (label: string, steps: [JobStatus, Date][], expect: Story["expect"], applications: Date[] = [], followUp: Date | null = null): Story => ({
  label,
  steps,
  applications,
  followUp,
  expect: { seen: steps[0][1], ...expect },
});

/** Seen, saved a day later, applied a day after that: the usual way in. */
const way = (applied: number): [JobStatus, Date][] => [
  ["seen", at(applied + 2, 21)],
  ["saved", at(applied + 1, 9)],
  ["applied", at(applied, 14)],
];
const inDays = (from: Date, days: number) => new Date(from.getTime() + days * DAY);

function ghosted(applied: number, then: { sent?: number[]; archived?: number; stopped?: boolean } = {}): Story {
  const steps = way(applied);
  const a = steps[2][1];
  // Follow-ups: a week after applying, then a week after each one you sent.
  const lastSent = then.sent?.length ? at(Math.min(...then.sent), 11) : null;
  const followUp = then.archived !== undefined || then.stopped ? null : inDays(lastSent ?? a, 7);
  if (then.archived !== undefined) steps.push(["archived", at(then.archived, 18)]);
  const what = then.archived !== undefined ? "gave up" : then.stopped ? "stopped follow-ups" : then.sent ? `${then.sent.length} follow-up(s) sent` : "no reply";
  return story(`applied ${applied}d ago, ${what}`, steps, { saved: steps[1][1], applied: a }, [a], followUp);
}

function stories(): Story[] {
  const s: Story[] = [];
  // Browsed and left in Seen (11), and dismissed straight from Seen (4).
  for (const d of [40, 37, 28, 23, 17, 14, 9, 7, 5, 2, 0]) s.push(story(`seen ${d}d ago`, [["seen", at(d, 20)]], {}));
  for (const [d, gone] of [[39, 39], [22, 21], [12, 12], [4, 3]]) s.push(story(`seen ${d}d ago, dismissed`, [["seen", at(d, 20)], ["archived", at(gone, 22)]], {}));

  // Saved, not applied (7): two dropped later, two either side of this week's midnight.
  for (const [d, gone] of [[35, 20], [18, 8]]) {
    const steps: [JobStatus, Date][] = [["seen", at(d + 1, 22)], ["saved", at(d, 9)], ["archived", at(gone, 9)]];
    s.push(story(`saved ${d}d ago, dropped`, steps, { saved: steps[1][1] }));
  }
  for (const d of [11, 8, 0]) s.push(story(`saved ${d}d ago`, [["seen", at(d, 8)], ["saved", at(d, 9)]], { saved: at(d, 9) }));
  const sundayNight = new Date(WEEK.getTime() - 1);
  s.push(story("saved Sunday 23:59:59.999 (last week)", [["seen", new Date(WEEK.getTime() - 3_600_000)], ["saved", sundayNight]], { saved: sundayNight }));
  s.push(story("saved Monday 00:00:00.000 (this week)", [["seen", new Date(WEEK.getTime() - 60_000)], ["saved", WEEK]], { saved: WEEK }));

  // Applied, no reply (13).
  s.push(ghosted(33, { archived: 10 }));
  s.push(ghosted(30, { stopped: true }));
  s.push(ghosted(27, { sent: [20, 13] }));
  s.push(ghosted(26, { archived: 5 }));
  s.push(ghosted(24, { sent: [17] }));
  s.push(ghosted(21, { sent: [14] }));
  s.push(ghosted(19, { sent: [12, 2] }));
  s.push(ghosted(16, { sent: [9] }));
  s.push(ghosted(13, { sent: [6] }));
  for (const d of [10, 6, 3, 1]) s.push(ghosted(d));

  // Applied twice: again after a referral, 17 days later. Still one job applied to.
  {
    const steps = way(29);
    const again = at(12, 16);
    s.push(story("applied twice (29d and 12d ago)", steps, { saved: steps[1][1], applied: steps[2][1] }, [steps[2][1], again], inDays(at(5, 11), 7)));
  }

  // Replies (4): two rejections, a rejection after an interview, an offer.
  for (const [d, no] of [[30, 22], [15, 4]]) {
    const steps = way(d);
    steps.push(["rejected", at(no, 13)]);
    s.push(story(`applied ${d}d ago, rejected ${no}d ago`, steps, { saved: steps[1][1], applied: steps[2][1], replied: steps[3][1] }, [steps[2][1]]));
  }
  {
    const steps = way(31);
    steps.push(["interviewing", at(20, 15)], ["rejected", at(9, 10)]);
    s.push(story("interviewed 20d ago, rejected 9d ago", steps, { saved: steps[1][1], applied: steps[2][1], replied: steps[3][1], interviewing: steps[3][1] }, [steps[2][1]]));
  }
  {
    const steps = way(36);
    steps.push(["interviewing", at(25, 15)], ["offer", at(3, 17)]);
    s.push(story("interviewed 25d ago, offer 3d ago", steps, { saved: steps[1][1], applied: steps[2][1], replied: steps[3][1], interviewing: steps[3][1], offer: steps[4][1] }, [steps[2][1]]));
  }
  return s;
}

/* ─── Write it ─── */

async function seed(all: Story[]) {
  const postings = await fetchPostings(all.length);
  await import("@/lib/db"); // creates the schema, as the app would
  const { newId } = await import("@/lib/ids");
  const db = new Database(join(folder, "slothing.db"));
  const iso = (d: Date) => d.toISOString();
  db.transaction(() => {
    all.forEach((st, i) => {
      const p = postings[i];
      const id = newId("job");
      const [first] = st.steps;
      const last = st.steps[st.steps.length - 1];
      const seenAt = first[0] === "seen" ? iso(first[1]) : null;
      db.prepare(
        `INSERT INTO jobs (id, company, title, url, location, description, status, notes, last_seen_at, visit_started_at, follow_up_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, ?, ?, ?, ?)`,
      ).run(id, p.company, p.title, p.url, p.location, p.description, last[0], seenAt, seenAt, st.followUp && iso(st.followUp), iso(first[1]), iso(last[1]));
      st.steps.forEach(([to, when], k) =>
        db.prepare("INSERT INTO job_events (job_id, from_status, to_status, at) VALUES (?, ?, ?, ?)").run(id, k ? st.steps[k - 1][0] : null, to, iso(when)),
      );
      for (const when of st.applications) db.prepare("INSERT INTO applications (id, job_id, url, answers, submitted_at) VALUES (?, ?, ?, '[]', ?)").run(newId("app"), id, p.url, iso(when));
    });
  })();
  db.close();
  writeFileSync(join(folder, "seed.json"), JSON.stringify({ now: NOW.toISOString(), stories: all.map((s) => s.label) }, null, 1));
}

/* ─── Check it ─── */

const zero = (): Counts => Object.fromEntries(STAGES.map((s) => [s, 0])) as Counts;

/** What the plan says, as of a moment: only what had happened by then. */
function expected(all: Story[], asOf: Date) {
  const week = zero();
  const total = zero();
  const since = weekStart(asOf).getTime();
  for (const st of all)
    for (const [stage, when] of Object.entries(st.expect) as [Stage, Date][]) {
      if (when > asOf) continue;
      total[stage]++;
      if (when.getTime() >= since) week[stage]++;
    }
  return { week, total };
}

let failures = 0;
function compare(what: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failures++;
  console.log(`${ok ? "ok  " : "FAIL"} ${what}${ok ? "" : `\n     got  ${JSON.stringify(got)}\n     want ${JSON.stringify(want)}`}`);
}
const line = (c: Counts) => STAGES.map((s) => `${c[s]} ${s}`).join(" · ");

async function check(all: Story[]) {
  const db = await import("@/lib/db");
  const { countInsights } = await import("@/lib/insights");
  const jobs = db.listJobs();
  const events = db.listEvents();
  const apps = db.listApplicationDates();

  // As of now, and as of earlier days (the app's data cut at that moment): before the first application, and mid-search.
  const firstApp = Math.min(...apps.map((a) => new Date(a.submittedAt).getTime()));
  for (const [name, asOf] of [
    ["now", NOW],
    ["mid-search (3 weeks ago)", at(21, 12)],
    ["before any application", new Date(firstApp - 1)],
    ["Monday 00:00:00.000 this week", WEEK],
  ] as const) {
    const t = asOf.toISOString();
    const got = countInsights(
      jobs.filter((j) => j.createdAt <= t),
      events.filter((e) => e.at <= t),
      apps.filter((a) => a.submittedAt <= t),
      asOf,
    );
    const want = expected(all, asOf);
    console.log(`\nAs of ${name} (${asOf.toLocaleString()}), week from ${weekStart(asOf).toLocaleString()}`);
    console.log(`  so far:    ${line(got.total)}`);
    console.log(`  this week: ${line(got.week)}`);
    compare("so far matches the plan", got.total, want.total);
    compare("this week matches the plan", got.week, want.week);
    if (name === "before any application") compare("no applications yet: nothing applied", got.total.applied, 0);
  }

  // The Jobs list: current statuses, and how they add up to the counts.
  const status = (s: JobStatus) => jobs.filter((j) => j.status === s).length;
  const counts = countInsights(jobs, events, apps, NOW).total;
  const lastStatus = (st: Story) => st.steps[st.steps.length - 1][0];
  const plannedStatus = (s: JobStatus) => all.filter((st) => lastStatus(st) === s).length;
  console.log(`\nJobs list: ${(["seen", "saved", "applied", "interviewing", "offer", "rejected", "archived"] as const).map((s) => `${status(s)} ${s}`).join(" · ")}`);
  compare("every job is in the list", jobs.length, counts.seen);
  for (const s of ["seen", "saved", "applied", "interviewing", "offer", "rejected", "archived"] as const) compare(`list: ${s}`, status(s), plannedStatus(s));
  const archivedAfterApplying = jobs.filter((j) => j.status === "archived" && j.appliedAt).length;
  compare("applied = applied + rejected + offer + interviewing + archived after applying", counts.applied, status("applied") + status("rejected") + status("offer") + status("interviewing") + archivedAfterApplying);
  compare("every applied job has an application", jobs.filter((j) => ["applied", "rejected", "interviewing", "offer"].includes(j.status) && !j.appliedAt).length, 0);
  compare("the job applied to twice has two applications and counts once", db.listApplicationDates().length - counts.applied, 1);
  const due = db.dueFollowUps().length;
  const wantDue = all.filter((st) => st.followUp && st.followUp <= NOW && lastStatus(st) === "applied").length;
  compare("follow-ups due", due, wantDue);

  if (app) await checkApp(counts, countInsights(jobs, events, apps).week, status);
  console.log(failures ? `\n${failures} check(s) failed.` : "\nEvery count matches.");
  process.exitCode = failures ? 1 : 0;
}

/** The Jobs page as served: the strip's numbers and the status counts line. */
async function checkApp(total: Counts, week: Counts, status: (s: JobStatus) => number) {
  const html = await (await fetch(app!)).text();
  const strip = html.match(/aria-label="Your search so far"[\s\S]*?<\/section>/)?.[0] ?? "";
  const text = strip.replace(/<!-- -->/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const cells = [...text.matchAll(/([A-Za-z]+) (\d+) (\d+) this week/g)].map((m) => [m[1], +m[2], +m[3]]);
  console.log(`\nJobs page (${app}): ${text.trim()}`);
  const labels = ["Seen", "Saved", "Applied", "Replies", "Interviews", "Offers"];
  compare("page: strip", cells, STAGES.map((s, i) => [labels[i], total[s], week[s]]));
  const list = html.match(/<p class="text-sm text-ink-2">([^<]*(?:<!-- -->[^<]*)*)<\/p>/)?.[1]?.replace(/<!-- -->/g, "") ?? "";
  const want = (["seen", "saved", "applied", "interviewing", "offer", "rejected", "archived"] as const).filter((s) => status(s)).map((s) => `${status(s)} ${s}`).join(" · ");
  compare("page: status counts line", list, `Now: ${want}`);
}

const all = stories();
if (!checkOnly) {
  await seed(all);
  console.log(`Seeded ${all.length} real postings into ${folder} as of ${NOW.toLocaleString()}.`);
}
await check(all);
