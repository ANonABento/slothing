/* Typst templates read their content from data.json, so user text never needs escaping. */

const COMMON = `
#let d = json("data.json")
#let nonempty(xs) = xs.filter(x => x != "")
#let contact-line = nonempty((d.contact.email, d.contact.phone, d.contact.location, ..d.contact.links)).join("  ·  ")
#let header = align(center)[
  #text(size: 20pt, weight: "bold", d.contact.name)
  #v(-6pt)
  #text(size: 9.5pt, fill: luma(60), contact-line)
]
`;

export const RESUME_TYP = `${COMMON}
#set page(paper: "us-letter", margin: (x: 0.6in, y: 0.55in))
#set text(font: "Libertinus Serif", size: 10.5pt)
#set par(leading: 0.48em, spacing: 0.6em)
#set list(indent: 4pt, body-indent: 5pt, spacing: 0.45em)

#let section(title) = {
  v(6pt)
  text(size: 9.5pt, weight: "bold", tracking: 0.08em, upper(title))
  v(-4pt)
  line(length: 100%, stroke: 0.5pt + luma(130))
  v(1pt)
}
#let row(l, r) = grid(columns: (1fr, auto), l, align(right, r))
#let range(a, b) = nonempty((a, b)).join(" – ")

#header

#if d.summary != "" {
  section("Summary")
  d.summary
}

#if d.experience.len() > 0 {
  section("Experience")
  for e in d.experience {
    block(breakable: false, below: 7pt)[
      #row(strong(e.title), range(e.start, e.end))
      #v(-4pt)
      #row(emph(e.company), emph(e.location))
      #if e.bullets.len() > 0 { v(-2pt); list(..e.bullets) }
    ]
  }
}

#if d.projects.len() > 0 {
  section("Projects")
  for p in d.projects {
    block(breakable: false, below: 7pt)[
      #row(strong(p.name), p.url)
      #if p.bullets.len() > 0 { v(-2pt); list(..p.bullets) }
    ]
  }
}

#if d.education.len() > 0 {
  section("Education")
  for e in d.education {
    block(breakable: false, below: 7pt)[
      #row(strong(e.school), range(e.start, e.end))
      #v(-4pt)
      #row(emph(e.degree), emph(e.location))
      #if e.details != "" { text(size: 10pt, e.details) }
    ]
  }
}

#if d.skills.len() > 0 {
  section("Skills")
  for s in d.skills [
    *#s.category:* #s.items.join(", ") \\
  ]
}
`;

export const LETTER_TYP = `${COMMON}
#set page(paper: "us-letter", margin: (x: 1in, y: 0.9in))
#set text(font: "Libertinus Serif", size: 11pt)
#set par(leading: 0.62em, spacing: 1.1em)

#header
#v(18pt)
#d.date

#d.recipient.company
#if d.recipient.title != "" [ \\ Re: #d.recipient.title ]

#d.greeting

#for p in d.paragraphs [ #p #parbreak() ]

#v(6pt)
#d.closing
#v(14pt)
#d.contact.name
`;
