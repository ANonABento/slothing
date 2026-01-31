import type { TailoredResume } from "./generator";

// Generate HTML resume that can be converted to PDF
export function generateResumeHTML(resume: TailoredResume): string {
  const { contact, summary, experiences, skills, education } = resume;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #333;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.5in;
    }
    h1 {
      font-size: 20pt;
      font-weight: 600;
      margin-bottom: 4px;
    }
    h2 {
      font-size: 12pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1.5px solid #333;
      padding-bottom: 3px;
      margin: 14px 0 8px 0;
    }
    h3 {
      font-size: 11pt;
      font-weight: 600;
      margin-bottom: 2px;
    }
    .header {
      text-align: center;
      margin-bottom: 12px;
    }
    .contact {
      font-size: 10pt;
      color: #555;
    }
    .contact a {
      color: #555;
      text-decoration: none;
    }
    .contact span {
      margin: 0 6px;
    }
    .summary {
      margin-bottom: 8px;
    }
    .experience-item {
      margin-bottom: 10px;
    }
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .company {
      font-weight: normal;
      color: #555;
    }
    .dates {
      font-size: 10pt;
      color: #666;
    }
    ul {
      margin-left: 16px;
      margin-top: 4px;
    }
    li {
      margin-bottom: 2px;
    }
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 12px;
    }
    .skill {
      font-size: 10pt;
    }
    .education-item {
      margin-bottom: 6px;
    }
    .edu-header {
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${contact.name}</h1>
    <div class="contact">
      ${contact.email ? `<a href="mailto:${contact.email}">${contact.email}</a>` : ""}
      ${contact.phone ? `<span>|</span>${contact.phone}` : ""}
      ${contact.location ? `<span>|</span>${contact.location}` : ""}
      ${contact.linkedin ? `<span>|</span><a href="https://${contact.linkedin}">${contact.linkedin}</a>` : ""}
      ${contact.github ? `<span>|</span><a href="https://${contact.github}">${contact.github}</a>` : ""}
    </div>
  </div>

  <section class="summary">
    <h2>Summary</h2>
    <p>${summary}</p>
  </section>

  <section>
    <h2>Experience</h2>
    ${experiences
      .map(
        (exp) => `
      <div class="experience-item">
        <div class="experience-header">
          <div>
            <h3>${exp.title}</h3>
            <span class="company">${exp.company}</span>
          </div>
          <span class="dates">${exp.dates}</span>
        </div>
        <ul>
          ${exp.highlights.map((h) => `<li>${h}</li>`).join("")}
        </ul>
      </div>
    `
      )
      .join("")}
  </section>

  <section>
    <h2>Skills</h2>
    <div class="skills">
      ${skills.map((s) => `<span class="skill">${s}</span>`).join(" • ")}
    </div>
  </section>

  ${
    education.length > 0
      ? `
  <section>
    <h2>Education</h2>
    ${education
      .map(
        (edu) => `
      <div class="education-item">
        <div class="edu-header">
          <div>
            <h3>${edu.degree} in ${edu.field}</h3>
            <span class="company">${edu.institution}</span>
          </div>
          <span class="dates">${edu.date}</span>
        </div>
      </div>
    `
      )
      .join("")}
  </section>
  `
      : ""
  }
</body>
</html>
  `.trim();
}

// Generate JSON representation for React-PDF rendering
export function generateResumeJSON(resume: TailoredResume) {
  return resume;
}
