import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";

import { AppContainer } from "../components/AppContainer";
import { ThemeProvider } from "../components/Theme/ThemeProvider";
import type { Theme } from "../components/Theme/ThemeProvider.types";
import "../styles/global.css";

const queryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },
};

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [queryClient] = React.useState(() => new QueryClient(queryClientOptions));
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window === "undefined") {return "light";}
    return (localStorage.getItem("theme") as Theme) ?? "light";
  });

  const handleSetTheme = (t: Theme) => {
    localStorage.setItem("theme", t);
    setTheme(t);
  };

  return (
    <>
      <Head>
        <title>Book Cook</title>
        <meta name="title" content="Book Cook" />
        <meta name="description" content="A site for storing recipes." />
        <link
          rel="icon"
          type="image/svg+xml"
          href="/image/Book-Cook-Logo.svg"
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme} setTheme={handleSetTheme}>
          <AppContainer>
            <Component {...pageProps} />
          </AppContainer>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
