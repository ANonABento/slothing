/* Typst templates read their content from data.json, so user text never needs escaping.
 * Every design choice comes from d.style (Settings → Resume design); the letter shares its font,
 * accent and header with the resume.
 */

const COMMON = `
#let d = json("data.json")
#let st = d.style
#let accent = rgb(st.accent)
#let base = st.size * 1pt
#let nonempty(xs) = xs.map(x => x.trim()).filter(x => x != "")
#let href(u) = {
  let t = u.trim()
  if t.starts-with("http://") or t.starts-with("https://") or t.starts-with("mailto:") { t } else { "https://" + t }
}
#let display-url(u) = u.trim().replace(regex("^https?://(www\\\\.)?"), "").trim("/", at: end)
#let link-icon = box(baseline: 0.14em, image(bytes(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='" + st.accent + "' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'><path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'/><path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'/></svg>"
), height: 0.85em))

// Boxed so a line only breaks between items, never inside a phone number or URL.
#let contact-parts = d.contactItems.map(i => box(if i.href != none { link(i.href, i.text) } else { i.text }))
#let header = {
  let big = if st.header == "center" { 2.0 } else { 2.3 }
  let name = text(font: st.headingFont, size: base * big, weight: "bold", d.contact.name)
  let sep = if st.header == "center" { "  ·  " } else { "  |  " }
  let contact = if contact-parts.len() > 0 { text(size: base * 0.95, contact-parts.join(sep)) }
  if st.header == "split" {
    grid(columns: (auto, 1fr), column-gutter: 16pt, align: (left + horizon, right + horizon), name, contact)
  } else {
    set align(if st.header == "center" { center } else { left })
    stack(spacing: base * 0.95, name, contact)
  }
}
`;

export const RESUME_TYP = `${COMMON}
#let sp = (
  tight: (leading: 0.42em, item: 0.32em, entry: 5pt, section: 9pt, rows: 0.32em),
  normal: (leading: 0.55em, item: 0.45em, entry: 7pt, section: 12pt, rows: 0.4em),
  airy: (leading: 0.68em, item: 0.6em, entry: 10pt, section: 15pt, rows: 0.5em),
).at(st.spacing)
#let margin-x = (narrow: 0.5in, normal: 0.6in, wide: 0.75in).at(st.margins)
#let margin-y = (narrow: 0.45in, normal: 0.55in, wide: 0.7in).at(st.margins)

#set page(paper: d.paper, margin: (x: margin-x, y: margin-y))
#set text(font: st.font, size: base)
#set par(leading: sp.leading, spacing: sp.leading + 0.25em)
// Every gap below is set explicitly (stack spacing, v()), so blocks add none of their own.
#set block(spacing: 0pt)
#set list(
  marker: text(fill: accent, size: if st.bullet == "●" { 0.72em } else { 1em }, baseline: if st.bullet == "●" { -0.12em } else { 0em }, st.bullet),
  indent: 2pt,
  body-indent: 6pt,
  spacing: sp.item,
)

#let section(title) = {
  let t = if st.headingCase == "caps" { upper(title) } else if st.headingCase == "smallcaps" { smallcaps(title) } else { title }
  let heading = text(font: st.headingFont, size: base * 1.12, weight: "bold", fill: accent, tracking: if st.headingCase == "caps" { 0.04em } else { 0em }, t)
  v(sp.section)
  block(sticky: true, {
    if st.headingRule == "beside" {
      grid(columns: (auto, 1fr), column-gutter: 8pt, align: horizon, heading, line(length: 100%, stroke: 0.6pt + accent))
      v(base * 0.45)
    } else {
      heading
      v(base * 0.3)
      if st.headingRule == "below" { line(length: 100%, stroke: 0.6pt + accent); v(base * 0.4) }
    }
  })
}

// Left and right on one line; none when both are empty, so empty fields leave no blank line.
#let row(l, r) = if l != none or r != none { grid(columns: (1fr, auto), column-gutter: 10pt, if l != none { l }, align(right, if r != none { r })) }
#let some(s, f) = if s.trim() != "" { f(s) }
#let range(a, b) = { let r = nonempty((a, b)).join(" – "); if r != none and r != "" { r } }
#let joined(parts, sep) = { let p = parts.filter(x => x != none); if p.len() > 0 { p.join(sep) } }
#let date-col = base * 9.5

/*
 * One entry: its heading lines, then bullets, kept together on one page. Each line is (left, right).
 * The date goes on the right of the first line, or in a column of its own when st.dates is "left".
 */
#let entry(date, lines, bullets: ()) = block(breakable: false, {
  let lines = lines.filter(l => l != none)
  if st.dates == "right" and date != none and lines.len() > 0 { lines.at(0) = (lines.at(0).at(0), date) }
  let parts = lines.map(((l, r)) => row(l, r)).filter(r => r != none)
  if bullets.len() > 0 { parts.push(list(..bullets)) }
  let body = stack(spacing: sp.rows, ..parts)
  if st.dates == "left" {
    grid(columns: (date-col, 1fr), column-gutter: 10pt, text(size: base * 0.95, if date != none { date }), body)
  } else { body }
})
// Entries of one section, with the entry gap between them (not after the last). f may return
// (content, tight: true) to sit closer to the one before, as a second role at the same company does.
#let entries(items, f) = for (i, x) in items.enumerate() {
  let out = f(x, i)
  let (body, tight) = if type(out) == dictionary { (out.body, out.tight) } else { (out, false) }
  if i > 0 { v(if tight { sp.rows + 0.15em } else { sp.entry }) }
  body
}
// Organisation name, linked (invisibly, like any resume link) when it has a URL.
#let org(name, url) = if name.trim() != "" { if url.trim() != "" { link(href(url), name) } else { name } }
// Heading lines for a role-shaped entry: title, organisation, location.
#let lines-for(title, organisation, location, continued: false) = {
  if st.entry == "inline" {
    if continued { ((title, none),) } else { ((joined((title, organisation, location), " — "), none),) }
  } else {
    if continued { ((title, none),) } else { ((title, none), (organisation, location)) }
  }
}

// One function per section, rendered in the order settings give (d.sections).
#let summary() = if d.summary != "" {
  section("Summary")
  par(d.summary)
}

#let experience() = if d.experience.len() > 0 {
  section("Experience")
  entries(d.experience, (e, i) => {
    let prev = if i > 0 { d.experience.at(i - 1) }
    // A promotion: same company as the role above, so its company line isn't repeated.
    let continued = st.groupRoles and prev != none and e.company.trim() != "" and prev.company.trim() == e.company.trim()
    let organisation = if e.company.trim() != "" { if st.entry == "inline" { org(e.company, e.url) } else { emph(org(e.company, e.url)) } }
    let body = entry(range(e.start, e.end), lines-for(some(e.title, strong), organisation, some(e.location, emph), continued: continued), bullets: e.bullets)
    (body: body, tight: continued)
  })
}

#let projects() = if d.projects.len() > 0 {
  section("Projects")
  entries(d.projects, (p, i) => {
    let name = if p.name.trim() != "" {
      let n = strong(p.name)
      if p.url.trim() != "" { link(href(p.url), n) } else { n }
    }
    let left = joined((name, ..p.tech.filter(t => t.trim() != "").map(t => [#t])), [ | ])
    let has-url = p.url.trim() != ""
    let left = if st.linkIcons and has-url { [#left #link(href(p.url), link-icon)] } else { left }
    let right = if not st.linkIcons and has-url { link(href(p.url), display-url(p.url)) }
    entry(none, ((left, right),), bullets: p.bullets)
  })
}

#let education() = if d.education.len() > 0 {
  section("Education")
  entries(d.education, (e, i) => {
    let details = if e.details.trim() != "" { (text(size: base * 0.95, e.details), none) }
    let degree = if e.degree.trim() != "" { if st.entry == "inline" { e.degree } else { emph(e.degree) } }
    entry(range(e.start, e.end), (..lines-for(some(e.school, strong), degree, some(e.location, emph)), details))
  })
}

#let skills() = if d.skills.len() > 0 {
  section("Skills")
  stack(spacing: sp.rows + 0.1em, ..d.skills.map(s => [#if s.category.trim() != "" [*#s.category:* ]#s.items.join(", ")]))
}

// Sections you name yourself (certifications, awards, leadership…): role-shaped entries.
#let extras() = for x in d.extras {
  section(x.title)
  entries(x.entries, (e, i) => {
    let title = if e.title.trim() != "" {
      let t = strong(e.title)
      if e.url.trim() != "" and e.org.trim() == "" { link(href(e.url), t) } else { t }
    }
    let organisation = if e.org.trim() != "" { if st.entry == "inline" { org(e.org, e.url) } else { emph(org(e.org, e.url)) } }
    // A one-line entry (a certification, an award) keeps issuer and title together on one line.
    let lines = if e.bullets.len() == 0 and e.location.trim() == "" { ((joined((title, organisation), " — "), none),) } else { lines-for(title, organisation, some(e.location, emph)) }
    entry(range(e.start, e.end), lines, bullets: e.bullets)
  })
}

#let sections = (summary: summary, experience: experience, projects: projects, education: education, skills: skills, extras: extras)

#header
#for name in d.sections { sections.at(name)() }

// Where the content ends, for fitting to the page (read with typst eval; invisible in the PDF).
#context [#metadata((page: here().page(), y: here().position().y.pt(), top: margin-y.pt(), bottom: (page.height - margin-y).pt())) <slothing-end>]
`;

export const LETTER_TYP = `${COMMON}
#set page(paper: d.paper, margin: (x: 1in, y: 0.9in))
#set text(font: st.font, size: 11pt)
#set par(leading: 0.62em, spacing: 1.1em)

#header
#if st.headingRule != "none" { v(2pt); line(length: 100%, stroke: 0.6pt + accent) }
#v(14pt)
#d.date

#nonempty((d.recipient.company, if d.recipient.title.trim() != "" { "Re: " + d.recipient.title } else { "" })).join(linebreak())

#d.greeting

#for p in d.paragraphs [ #p #parbreak() ]

#v(6pt)
#if d.closing.trim() != "" [#d.closing #v(14pt)]
#d.contact.name
`;
