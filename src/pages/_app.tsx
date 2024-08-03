import * as React from "react";
import { tokens } from "@fluentui/react-components";
import { SSRProvider } from "@fluentui/react-utilities";
import type { AppProps } from "next/app";
import Head from "next/head";
import { RendererProvider, createDOMRenderer } from "@griffel/react";
import { AppContainer } from "../components";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../clients";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>My Status</title>
        <meta name="title" content="My Status" />
        <meta
          name="description"
          content="A site that showcases various statuses such as Team's presence."
        />
        <link rel="icon" type="image/svg+xml" href="/image/favicon.svg" />
      </Head>
      <style jsx global>{`
        body {
          background-color: ${tokens.colorNeutralBackground1};
          padding: 0px;
          margin: 0px;
          height: 100%;
          overflow: hidden;
        }
        html {
          height: 100%;
        }
        #__next {
          height: 100%;
        }
      `}</style>
      <RendererProvider renderer={pageProps.renderer || createDOMRenderer()}>
        <SSRProvider>
          {isMounted && (
            <AppContainer>
              <Component {...pageProps} />
            </AppContainer>
          )}
        </SSRProvider>
      </RendererProvider>
    </QueryClientProvider>
  );
}
