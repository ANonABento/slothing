import { Users, FileText, ScanSearch } from "lucide-react";

const outcomes = [
  {
    icon: ScanSearch,
    title: "ATS-aware tailoring",
    description:
      "Slothing matches resume language against the exact ATS keywords most likely to be parsed.",
  },
  {
    icon: FileText,
    title: "One career profile, infinite resumes",
    description:
      "Upload once. Generate a tailored resume for every role in under a minute.",
  },
  {
    icon: Users,
    title: "Track every application",
    description:
      "Capture, prioritize, and follow up - never lose a promising lead in your inbox.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How Slothing Helps
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Turn every application into a{" "}
            <span className="gradient-text">tailored opportunity</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Slothing helps you adapt your resume, manage applications, and keep
            your job search moving without relying on fabricated social proof.
          </p>
        </div>

        {/* Outcomes Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {outcomes.map((outcome) => (
            <div
              key={outcome.title}
              className="relative p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow duration-300"
            >
              <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                <outcome.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{outcome.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                {outcome.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
