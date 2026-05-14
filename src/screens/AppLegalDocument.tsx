"use client";

import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import type { LegalPageDoc } from "@/lib/content/legalPageTypes";

const legalBodyClass =
  "text-muted-foreground text-sm leading-relaxed [font-family:var(--font-body)] " +
  // Match previous static legal layout spacing + heading styles
  "[&>div>*+*]:mt-6 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:font-display [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground " +
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-primary [&_a]:underline hover:[&_a]:opacity-90 " +
  "[&_pre]:whitespace-pre-wrap [&_pre]:[font-family:var(--font-body)] [&_pre]:text-muted-foreground [&_code]:[font-family:var(--font-body)]";

export default function AppLegalDocument({ doc }: { doc?: LegalPageDoc }) {
  // Guard avoids runtime crash if a legacy route loads before props hydrate.
  if (!doc) {
    return null;
  }

  usePageAnalytics(doc.analyticsPage);

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-bold font-display mb-8">{doc.title}</h1>
        <div className={legalBodyClass}>
          <div dangerouslySetInnerHTML={{ __html: doc.html }} />
        </div>
      </div>
    </section>
  );
}
