import type { Metadata, Viewport } from "next";
import "@/index.css";
import AppProviders from "@/components/AppProviders";
import AppLayoutClient from "@/components/AppLayoutClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Trackzio — AI-Powered Apps for Curious Minds",
    template: "%s | Trackzio",
  },
  description:
    "Trackzio builds intelligent mobile apps that bridge curiosity and clarity through AI.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AppProviders>
          <AppLayoutClient>{children}</AppLayoutClient>
        </AppProviders>
      </body>
    </html>
  );
}
