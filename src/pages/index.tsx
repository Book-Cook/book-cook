import * as React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { LoadingScreen } from "../components/FallbackScreens";
import LandingPage from "../components/LandingPage/LandingPage";

export default function Index() {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (session) {
      void router.replace("/recipes");
    }
  }, [session, router]);

  // LandingPage is static markup, so it is imported directly and rendered while
  // the session is still resolving. Deferring it behind a dynamic import and a
  // `status === "loading"` gate served first-time visitors an empty shell that
  // painted nothing until both the JS bundle and an auth round trip finished.
  if (status === "authenticated") {
    return <LoadingScreen />;
  }

  return <LandingPage />;
}
