import type { AppProps } from "next/app";
import Head from "next/head";
import AppProviders from "@/components/AppProviders";
import PagesLayoutClient from "@/components/PagesLayoutClient";
import { fontVariableClassName } from "@/lib/fonts";
import "@/index.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={fontVariableClassName}>
        <PagesLayoutClient>
          <Component {...pageProps} />
        </PagesLayoutClient>
      </div>
    </AppProviders>
  );
}
