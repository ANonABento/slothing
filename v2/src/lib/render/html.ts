import type { ResolvedLetter, ResolvedResume } from "../types";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const join = (parts: string[], sep: string) => parts.filter((p) => p.trim()).map(esc).join(sep);
const range = (a: string, b: string) => join([a, b], " – ");

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
  const row = (l: string, r: string, cls = "") => `<div class="row ${cls}"><span>${l}</span><span>${r}</span></div>`;

  const exp = r.experience
    .map((e) => `<div class="entry">${row(`<b>${esc(e.title)}</b>`, range(e.start, e.end))}${row(`<i>${esc(e.company)}</i>`, `<i>${esc(e.location)}</i>`)}${bullets(e.bullets)}</div>`)
    .join("");
  const prj = r.projects
    .map((p) => `<div class="entry">${row(`<b>${esc(p.name)}</b>`, esc(p.url))}${bullets(p.bullets)}</div>`)
    .join("");
  const edu = r.education
    .map((e) => `<div class="entry">${row(`<b>${esc(e.school)}</b>`, range(e.start, e.end))}${row(`<i>${esc(e.degree)}</i>`, `<i>${esc(e.location)}</i>`)}${e.details ? `<div class="details">${esc(e.details)}</div>` : ""}</div>`)
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
      <div class="contact">${join([r.contact.email, r.contact.phone, r.contact.location, ...r.contact.links], "  ·  ")}</div></header>
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
      <div class="contact">${join([l.contact.email, l.contact.phone, l.contact.location, ...l.contact.links], "  ·  ")}</div></header>
    <p>${esc(l.date)}</p>
    <p>${join([l.recipient.company], "")}${l.recipient.title ? `<br>Re: ${esc(l.recipient.title)}` : ""}</p>
    <p>${esc(l.greeting)}</p>
    ${l.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
    <p style="margin-top:16pt">${esc(l.closing)}<br><br>${esc(l.contact.name)}</p>
  </body></html>`;
}
