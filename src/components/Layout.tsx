"use client";

import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect } from "react";
import { initSession } from "@/lib/analytics";

export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    initSession();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
