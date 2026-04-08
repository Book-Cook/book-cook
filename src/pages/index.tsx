import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { LoadingScreen } from "../components/FallbackScreens";

const LandingPage = dynamic(
  () => import("../components/LandingPage/LandingPage"),
  { loading: () => <LoadingScreen /> },
);

export default function Index() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (session) {
    void router.replace("/recipes");
    return <LoadingScreen />;
  }

  return <LandingPage />;
}
