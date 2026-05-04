type LegalSection = {
  title: string;
  body: string;
};

type LegalPageProps = {
  title: string;
  effectiveDate: string;
  sections: readonly LegalSection[];
};

export function LegalPage({ title, effectiveDate, sections }: LegalPageProps) {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-32">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          <p className="mt-3 text-foreground">Effective {effectiveDate}.</p>
        </div>

        <div className="space-y-8 text-sm leading-7 text-foreground">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-foreground">
                {section.title}
              </h2>
              <p className="mt-2">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
