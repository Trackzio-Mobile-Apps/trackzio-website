import { ReactNode, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
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
