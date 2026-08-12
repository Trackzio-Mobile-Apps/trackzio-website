import type { Metadata, Viewport } from "next";
import "@/index.css";
import AppProviders from "@/components/AppProviders";
import AppLayoutClient from "@/components/AppLayoutClient";
import JsonLd from "@/components/JsonLd";
import { fontVariableClassName } from "@/lib/fonts";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
  organizationJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png" }],
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: DEFAULT_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariableClassName}>
      <body className="min-h-screen antialiased">
        <JsonLd data={organizationJsonLd()} />
        <AppProviders>
          <AppLayoutClient>{children}</AppLayoutClient>
        </AppProviders>
      </body>
    </html>
  );
}
