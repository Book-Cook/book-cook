import * as React from "react";
import { tokens } from "@fluentui/react-components";
import { SSRProvider } from "@fluentui/react-utilities";
import { RendererProvider, createDOMRenderer } from "@griffel/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { AppProps } from "next/app";
import Head from "next/head";

import { queryClient } from "../clients/react-query";
import { AppContainer } from "../components";

const SITE_NAME = "Book Cook";
const DEFAULT_DESCRIPTION =
  "Discover, create, and store your favorite recipes with Book Cook. Your personal digital cookbook.";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Book Cook</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="title" content={SITE_NAME} />
        <meta name="description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:type" content="website" />
        <link
          rel="icon"
          type="image/svg+xml"
          href="/image/Book-Cook-Logo.svg"
        />
      </Head>
      <style>
        {`
          body {
            background-color: ${tokens.colorNeutralBackground1};
            padding: 0px;
            margin: 0px;
            height: 100%;
          }
          html {
            height: 100%;
          }
          #__next {
            height: 100%;
          }
        `}
      </style>
      <QueryClientProvider client={queryClient}>
        <RendererProvider renderer={pageProps.renderer ?? createDOMRenderer()}>
          <SSRProvider>
            {isMounted && (
              <AppContainer>
                <Component {...pageProps} />
                <Analytics />
                <SpeedInsights />
              </AppContainer>
            )}
          </SSRProvider>
        </RendererProvider>
      </QueryClientProvider>
    </>
  );
}
