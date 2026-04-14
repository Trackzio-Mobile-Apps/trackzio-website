import type { AppProps } from "next/app";
import Head from "next/head";
import AppProviders from "@/components/AppProviders";
import PagesLayoutClient from "@/components/PagesLayoutClient";
import "@/index.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
      <Head>
        <title>Trackzio — AI-Powered Apps for Curious Minds</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PagesLayoutClient>
        <Component {...pageProps} />
      </PagesLayoutClient>
    </AppProviders>
  );
}
