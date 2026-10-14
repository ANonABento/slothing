import type { ResolvedLetter, ResolvedResume } from "../types";
import { contactItems, displayUrl, linkTarget } from "./contact";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const join = (parts: string[], sep: string) => parts.filter((p) => p.trim()).map(esc).join(sep);
const range = (a: string, b: string) => join([a, b], " – ");
const contactLine = (c: ResolvedResume["contact"]) =>
  contactItems(c)
    .map((i) => (i.href ? `<a href="${esc(i.href)}">${esc(i.text)}</a>` : esc(i.text)))
    .join("  ·  ");

const BASE_CSS = `
  @page { size: letter; margin: 0.55in 0.6in; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Charter, "Bitstream Charter", Georgia, serif; font-size: 10.5pt; line-height: 1.32; color: #111; }
  a { color: inherit; text-decoration: none; }
  header { text-align: center; margin-bottom: 6pt; }
  h1 { font-size: 20pt; margin: 0 0 2pt; letter-spacing: 0.01em; }
  .contact { font-size: 9.5pt; color: #333; }
`;

export function resumeHtml(r: ResolvedResume): string {
  const section = (title: string, body: string) =>
    body ? `<section><h2>${title}</h2>${body}</section>` : "";
  const bullets = (b: string[]) => (b.length ? `<ul>${b.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "");
  // Skip the row entirely when both sides are empty, so empty fields don't leave blank lines.
  const row = (l: string, r: string) => (l || r ? `<div class="row"><span>${l}</span><span>${r}</span></div>` : "");
  const b = (s: string) => (s.trim() ? `<b>${esc(s)}</b>` : "");
  const i = (s: string) => (s.trim() ? `<i>${esc(s)}</i>` : "");
  const url = (u: string) => {
    const href = linkTarget(u);
    return href ? `<a href="${esc(href)}">${esc(displayUrl(u))}</a>` : esc(u);
  };

  const exp = r.experience
    .map((e) => `<div class="entry">${row(b(e.title), range(e.start, e.end))}${row(i(e.company), i(e.location))}${bullets(e.bullets)}</div>`)
    .join("");
  const prj = r.projects
    .map((p) => `<div class="entry">${row(b(p.name), url(p.url))}${bullets(p.bullets)}</div>`)
    .join("");
  const edu = r.education
    .map((e) => `<div class="entry">${row(b(e.school), range(e.start, e.end))}${row(i(e.degree), i(e.location))}${e.details.trim() ? `<div class="details">${esc(e.details)}</div>` : ""}</div>`)
    .join("");
  const skills = r.skills.map((s) => `<div><b>${esc(s.category)}:</b> ${esc(s.items.join(", "))}</div>`).join("");

  return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}
    h2 { font-size: 9.5pt; letter-spacing: 0.08em; text-transform: uppercase; margin: 10pt 0 4pt; padding-bottom: 2pt; border-bottom: 0.5pt solid #888; }
    .entry { margin-bottom: 5pt; break-inside: avoid; }
    .row { display: flex; justify-content: space-between; gap: 12pt; }
    ul { margin: 2pt 0 0; padding-left: 14pt; }
    li { margin: 1pt 0; }
    .details { font-size: 10pt; }
  </style></head><body>
    <header><h1>${esc(r.contact.name)}</h1>
      <div class="contact">${contactLine(r.contact)}</div></header>
    ${section("Summary", r.summary ? `<p style="margin:0">${esc(r.summary)}</p>` : "")}
    ${section("Experience", exp)}
    ${section("Projects", prj)}
    ${section("Education", edu)}
    ${section("Skills", skills)}
  </body></html>`;
}

export function letterHtml(l: ResolvedLetter): string {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}
    @page { margin: 0.9in 1in; }
    body { font-size: 11pt; line-height: 1.45; }
    header { margin-bottom: 22pt; }
    p { margin: 0 0 10pt; }
  </style></head><body>
    <header><h1>${esc(l.contact.name)}</h1>
      <div class="contact">${contactLine(l.contact)}</div></header>
    <p>${esc(l.date)}</p>
    ${l.recipient.company.trim() || l.recipient.title.trim() ? `<p>${[esc(l.recipient.company.trim()), l.recipient.title.trim() ? `Re: ${esc(l.recipient.title)}` : ""].filter(Boolean).join("<br>")}</p>` : ""}
    <p>${esc(l.greeting)}</p>
    ${l.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
    <p style="margin-top:16pt">${l.closing.trim() ? `${esc(l.closing)}<br><br>` : ""}${esc(l.contact.name)}</p>
  </body></html>`;
}
