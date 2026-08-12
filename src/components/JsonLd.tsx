import { jsonLdScript } from "@/lib/seo";

export default function JsonLd({ data }: { data: unknown | unknown[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScript(data) }}
    />
  );
}
