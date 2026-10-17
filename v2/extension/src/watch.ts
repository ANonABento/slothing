import { read } from "./page";

/* ─── Runs on every page you open (top frame only) ───
 * Decides, locally, what the page is: a job posting, an application form, a sign-in page, or nothing.
 * Only a posting is sent anywhere (to Slothing, to record it as seen); every other page is just a badge.
 * Also notices when you submit a form Slothing filled, so the job can be marked applied.
 */

export interface PageKind {
  job: boolean;
  form: boolean;
  login: boolean;
}

// Posting URLs on the boards most companies use. A page with schema.org JobPosting data counts too.
const POSTING_URL = [
  /greenhouse\.io\/[\w-]+\/jobs\/\d+/,
  /[?&]gh_jid=\d+/,
  /jobs\.lever\.co\/[\w-]+\/[0-9a-f-]{36}/,
  /jobs\.ashbyhq\.com\/[\w-]+\/[0-9a-f-]{36}/,
  /myworkdayjobs\.com\/.*\/job\//,
  /linkedin\.com\/jobs\/(view\/|.*[?&]currentJobId=)/,
  /indeed\.com\/.*[?&]vjk=|indeed\.com\/viewjob/,
];
// Forms embedded from an applicant tracking system (a Greenhouse iframe on a company's careers page).
const ATS_FRAME = /greenhouse\.io|lever\.co|ashbyhq\.com|myworkdayjobs\.com|smartrecruiters\.com|workable\.com/;

const visible = (el: Element) => (el as HTMLElement).getClientRects().length > 0;

/** Fields you'd fill in: visible, enabled, not buttons or hidden helpers. Read-only: the page isn't touched. */
function inputs() {
  return [...document.querySelectorAll<HTMLInputElement>("input, textarea, select")].filter((el) => {
    const type = (el.type || "").toLowerCase();
    if (["hidden", "submit", "button", "reset", "image", "checkbox", "search"].includes(type) || el.disabled) return false;
    return type === "file" || (visible(el) && el.tabIndex >= 0);
  });
}

function classify(): PageKind {
  const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].some((s) => /"JobPosting"/.test(s.textContent ?? ""));
  const job = ld || POSTING_URL.some((re) => re.test(location.href));
  const all = inputs();
  const password = all.some((el) => el.type === "password");
  // A sign-in or sign-up page: a password field and not much else.
  const login = password && all.length <= 6;
  const form =
    !password &&
    ((all.length >= 4 && all.some((el) => el.type === "file" || el.type === "email")) || [...document.querySelectorAll("iframe")].some((f) => ATS_FRAME.test(f.src) && visible(f)));
  return { job, form, login };
}

let last = "";
function report() {
  const kind = classify();
  const key = `${location.href}|${kind.job}|${kind.form}|${kind.login}`;
  if (key === last) return;
  last = key;
  // The posting itself only for a job page: that's what gets recorded. Nothing else leaves the page.
  const posting = kind.job ? { html: document.documentElement.outerHTML.slice(0, 5_000_000), text: (document.body?.innerText ?? "").slice(0, 100_000) } : {};
  void chrome.runtime.sendMessage({ type: "page", url: location.href, title: document.title, kind, ...posting }).catch(() => {});
}

// Pages that build themselves after load (LinkedIn, Ashby, Workday) get a few more looks, and
// single-page apps that change the URL without loading a page are followed.
report();
setTimeout(report, 1500);
setTimeout(report, 4000);
let href = location.href;
setInterval(() => {
  if (location.href === href) return;
  href = location.href;
  setTimeout(report, 800);
  setTimeout(report, 2500);
}, 1000);

/* ─── Submitting ─── */

let sent = false;
function submitted() {
  // Only forms Slothing filled: anything else is none of its business.
  if (sent || !document.querySelector("[data-slothing-filled]")) return;
  sent = true;
  void chrome.runtime.sendMessage({ type: "submitted", url: location.href, fields: read().fields }).catch(() => {});
}

document.addEventListener("submit", submitted, true);
document.addEventListener(
  "click",
  (e) => {
    const b = (e.target as Element | null)?.closest('button, input[type="submit"], [role="button"]');
    const text = (b as HTMLElement | null)?.innerText || (b as HTMLInputElement | null)?.value || "";
    if (b && /\bsubmit\b/i.test(text)) submitted();
  },
  true,
);
