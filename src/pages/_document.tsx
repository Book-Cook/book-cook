import { Html, Head, Main, NextScript } from "next/document";
import { blockingThemeScript } from "../context";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="application-name" content="Book Cook" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Book Cook" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#e1d7ff" />
        <script dangerouslySetInnerHTML={{ __html: blockingThemeScript }} />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="shortcut icon" href="/icons/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/icons/favicon-96x96.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
