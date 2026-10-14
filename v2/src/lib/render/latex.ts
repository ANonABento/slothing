import type { ResolvedLetter, ResolvedResume } from "../types";
import { contactItems, displayUrl, linkTarget } from "./contact";

const TEX_ESCAPES: Record<string, string> = {
  "\\": "\\textbackslash{}",
  "&": "\\&",
  "%": "\\%",
  $: "\\$",
  "#": "\\#",
  _: "\\_",
  "{": "\\{",
  "}": "\\}",
  "~": "\\textasciitilde{}",
  "^": "\\textasciicircum{}",
};
// One pass, so the braces we insert for \textbackslash{} aren't escaped again.
const tex = (s: string) => s.replace(/[\\&%$#_{}~^]/g, (m) => TEX_ESCAPES[m]);
const texUrl = (u: string) => u.replace(/[\\%#]/g, (m) => `\\${m}`);

const nonempty = (parts: string[]) => parts.map((p) => p.trim()).filter(Boolean);
const join = (parts: string[], sep: string) => nonempty(parts).map(tex).join(sep);
const range = (a: string, b: string) => join([a, b], " -- ");
const link = (raw: string) => {
  const href = linkTarget(raw);
  return href ? `\\href{${texUrl(href)}}{${tex(displayUrl(raw))}}` : tex(raw);
};

/** Left/right row; omitted entirely when both sides are empty so no blank line is left behind. */
const row = (l: string, r: string) => (l || r ? `\\row{${l}}{${r}}\n` : "");
const bold = (s: string) => (s.trim() ? `\\textbf{${tex(s)}}` : "");
const ital = (s: string) => (s.trim() ? `\\textit{${tex(s)}}` : "");

/** Lines joined with \\, never starting a paragraph with a line break (which LaTeX rejects). */
const lines = (parts: string[]) => parts.filter(Boolean).join("\\\\\n");

const PREAMBLE = `\\documentclass[10pt,letterpaper]{article}
\\usepackage[margin=0.6in,top=0.55in,bottom=0.55in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage[hidelinks]{hyperref}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlist[itemize]{leftmargin=14pt,topsep=1pt,itemsep=0pt,parsep=1pt}
\\titleformat{\\section}{\\small\\bfseries\\scshape}{}{0pt}{}[\\vspace{-6pt}\\rule{\\linewidth}{0.4pt}]
\\titlespacing*{\\section}{0pt}{8pt}{4pt}
\\newcommand{\\row}[2]{#1\\hfill #2\\\\}
`;

function header(c: ResolvedResume["contact"]) {
  const contact = contactItems(c)
    .map((i) => (i.href ? `\\href{${texUrl(i.href)}}{${tex(i.text)}}` : tex(i.text)))
    .join(" \\textperiodcentered\\ ");
  const name = c.name.trim() ? `{\\LARGE\\bfseries ${tex(c.name)}}` : "";
  return `\\begin{center}
${lines([name, contact ? `{\\small ${contact}}` : ""]) || "\\mbox{}"}
\\end{center}
`;
}

// \item{} so a bullet starting with "[" isn't parsed as the item's optional label.
const itemize = (b: string[]) =>
  b.length ? `\\vspace{-9pt}\\begin{itemize}\n${b.map((x) => `  \\item{}${tex(x)}`).join("\n")}\n\\end{itemize}\n` : "";

export function resumeTex(r: ResolvedResume): string {
  const out: string[] = [PREAMBLE, "\\begin{document}", header(r.contact)];
  if (r.summary.trim()) out.push(`\\section{Summary}\n${tex(r.summary)}\n`);
  if (r.experience.length) {
    out.push("\\section{Experience}");
    for (const e of r.experience)
      out.push(`${row(bold(e.title), range(e.start, e.end))}${row(ital(e.company), ital(e.location))}${itemize(e.bullets)}\\vspace{4pt}\n`);
  }
  if (r.projects.length) {
    out.push("\\section{Projects}");
    for (const p of r.projects) out.push(`${row(bold(p.name), p.url.trim() ? link(p.url) : "")}${itemize(p.bullets)}\\vspace{4pt}\n`);
  }
  if (r.education.length) {
    out.push("\\section{Education}");
    for (const e of r.education)
      out.push(
        `${row(bold(e.school), range(e.start, e.end))}${row(ital(e.degree), ital(e.location))}${e.details.trim() ? `{\\small ${tex(e.details)}}\\\\\n` : ""}\\vspace{4pt}\n`,
      );
  }
  if (r.skills.length) {
    out.push("\\section{Skills}");
    out.push(r.skills.map((s) => `${bold(s.category ? `${s.category}:` : "")} ${tex(s.items.join(", "))}`).join("\\\\\n"));
  }
  out.push("\\end{document}");
  return out.join("\n");
}

export function letterTex(l: ResolvedLetter): string {
  const preamble = PREAMBLE.replace("margin=0.6in,top=0.55in,bottom=0.55in", "margin=1in,top=0.9in,bottom=0.9in").replace("10pt", "11pt");
  const recipient = lines([tex(l.recipient.company.trim()), l.recipient.title.trim() ? `Re: ${tex(l.recipient.title)}` : ""]);
  const signoff = l.closing.trim() ? `${tex(l.closing)}\\\\[14pt]\n${tex(l.contact.name)}` : tex(l.contact.name);
  return [
    preamble,
    "\\setlength{\\parskip}{9pt}",
    "\\begin{document}",
    header(l.contact),
    "\\vspace{10pt}",
    tex(l.date),
    recipient,
    tex(l.greeting),
    ...l.paragraphs.map(tex),
    signoff,
    "\\end{document}",
  ]
    .filter((x) => x.trim())
    .join("\n\n");
}
