import { getSiteMetadata } from "@/lib/seo";

export type BlogPostSlug = (typeof BLOG_POSTS)[number]["slug"];

export type BlogSection = {
  heading: string;
  body: string;
  bullets?: string[];
};

type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedDate: string;
  readMinutes: number;
  audience: string;
  sections: BlogSection[];
  ctaHeadline: string;
  ctaText: string;
  ctaHref: string;
};

export const BLOG_POSTS = [
  {
    slug: "what-is-ats-optimization",
    title: "What is ATS optimization, and how to make your resume pass it",
    description:
      "A practical guide to how Applicant Tracking Systems work and how to tune your resume for better machine parsing results.",
    publishedDate: "2026-05-15",
    readMinutes: 7,
    audience: "job seekers",
    sections: [
      {
        heading: "Why ATS filtering matters",
        body: "ATS systems parse resumes to pull out skills, job titles, and dates. If text is too visually noisy or inconsistent, important sections can be missed and your application can drop into low-priority queues.",
      },
      {
        heading: "How ATS parsing fails",
        body: "Common failures are usually formatting issues, weak keyword alignment, and mixed role titles that don't match the posting requirements.",
        bullets: [
          "Tables and image-based resumes reduce parse reliability",
          "Inconsistent role/timeline formatting makes matching harder",
          "Buzzword-heavy summaries can dilute signal",
        ],
      },
      {
        heading: "Practical optimization sequence",
        body: "Focus on a clean structure first: clear heading hierarchy, concise job entries, and role-aligned language for each job and project.",
        bullets: [
          "Keep a reverse-chronological structure with clear dates",
          "Use plain text for core resume blocks before creative design elements",
          "Mirror critical keywords from the posting, but avoid stuffing",
          "Use action verbs and measurable outcomes to improve ranking and clarity",
        ],
      },
      {
        heading: "Where Slothing helps",
        body: "Use the ATS scanner to see what likely passes, then tailor sections with feedback loops instead of guesswork.",
      },
    ],
    ctaHeadline: "Try Slothing ATS Scoring",
    ctaText:
      "Run your resume text through Slothing and see concrete improvement gaps.",
    ctaHref: "/ats-scanner",
  },
  {
    slug: "self-hosted-job-search",
    title: "Self-hosted job search workflows: better control, better privacy",
    description:
      "A concise breakdown of self-hosting job-search tooling for privacy, ownership, and predictable costs.",
    publishedDate: "2026-05-15",
    readMinutes: 6,
    audience: "privacy-first professionals",
    sections: [
      {
        heading: "Why people move to self-hosted tooling",
        body: "Teams and solo professionals increasingly want ownership over where application data lives, who can access it, and how prompts and API keys are handled.",
        bullets: [
          "Control where your data is stored",
          "Bring your own LLM keys when you want full model and cost control",
          "Keep integrations and workflow customizations under your own change control",
        ],
      },
      {
        heading: "Trade-offs to expect",
        body: "Self-hosting brings flexibility, but also deployment and upgrade responsibility. Decide whether team workflows justify that overhead.",
        bullets: [
          "Higher upfront setup and maintenance effort",
          "More control over auditability and incident handling",
          "Fewer opaque vendor lock-in paths",
        ],
      },
      {
        heading: "Migration checklist",
        body: "Start with a narrow pilot: one account, one role workflow, and one AI model path. Then expand after confidence in backups and sync reliability.",
        bullets: [
          "Document your authentication and backup plan",
          "Verify export/import behavior for opportunities and documents",
          "Create a rollback path before switching your weekly workflow",
        ],
      },
    ],
    ctaHeadline: "Prefer self-hosting?",
    ctaText:
      "Deploy Slothing your way and keep control over how your job-search assistant runs.",
    ctaHref: "/pricing",
  },
] as const satisfies ReadonlyArray<BlogPost>;

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getBlogPostUrls() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export function getBlogJsonLdBase() {
  const siteMetadata = getSiteMetadata();

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Slothing Blog",
    description: siteMetadata.description,
    url: `${siteMetadata.metadataBase}/blog`,
  };
}
