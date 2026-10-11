import type { ResolvedLetter, ResolvedResume } from "../types";

const tex = (s: string) =>
  s
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([&%$#_{}])/g, "\\$1")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");

const join = (parts: string[], sep: string) => parts.filter((p) => p.trim()).map(tex).join(sep);
const range = (a: string, b: string) => join([a, b], " -- ");

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
  return `\\begin{center}
{\\LARGE\\bfseries ${tex(c.name)}}\\\\[3pt]
{\\small ${join([c.email, c.phone, c.location, ...c.links], " \\textperiodcentered\\ ")}}
\\end{center}
`;
}

const itemize = (b: string[]) =>
  b.length ? `\\vspace{-9pt}\\begin{itemize}\n${b.map((x) => `  \\item ${tex(x)}`).join("\n")}\n\\end{itemize}\n` : "";

export function resumeTex(r: ResolvedResume): string {
  const out: string[] = [PREAMBLE, "\\begin{document}", header(r.contact)];
  if (r.summary) out.push(`\\section{Summary}\n${tex(r.summary)}\n`);
  if (r.experience.length) {
    out.push("\\section{Experience}");
    for (const e of r.experience)
      out.push(`\\row{\\textbf{${tex(e.title)}}}{${range(e.start, e.end)}}\n\\row{\\textit{${tex(e.company)}}}{\\textit{${tex(e.location)}}}\n${itemize(e.bullets)}\\vspace{4pt}\n`);
  }
  if (r.projects.length) {
    out.push("\\section{Projects}");
    for (const p of r.projects) out.push(`\\row{\\textbf{${tex(p.name)}}}{${tex(p.url)}}\n${itemize(p.bullets)}\\vspace{4pt}\n`);
  }
  if (r.education.length) {
    out.push("\\section{Education}");
    for (const e of r.education)
      out.push(`\\row{\\textbf{${tex(e.school)}}}{${range(e.start, e.end)}}\n\\row{\\textit{${tex(e.degree)}}}{\\textit{${tex(e.location)}}}\n${e.details ? `{\\small ${tex(e.details)}}\\\\\n` : ""}\\vspace{4pt}\n`);
  }
  if (r.skills.length) {
    out.push("\\section{Skills}");
    out.push(r.skills.map((s) => `\\textbf{${tex(s.category)}:} ${tex(s.items.join(", "))}`).join("\\\\\n"));
  }
  out.push("\\end{document}");
  return out.join("\n");
}

export function letterTex(l: ResolvedLetter): string {
  return `${PREAMBLE.replace("margin=0.6in,top=0.55in,bottom=0.55in", "margin=1in,top=0.9in,bottom=0.9in").replace("10pt", "11pt")}
\\setlength{\\parskip}{9pt}
\\begin{document}
${header(l.contact)}
\\vspace{10pt}
${tex(l.date)}

${tex(l.recipient.company)}${l.recipient.title ? `\\\\\nRe: ${tex(l.recipient.title)}` : ""}

${tex(l.greeting)}

${l.paragraphs.map(tex).join("\n\n")}

${tex(l.closing)}\\\\[14pt]
${tex(l.contact.name)}
\\end{document}`;
}
