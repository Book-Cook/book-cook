import * as React from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

// Dynamically import the landing page if the user is not authenticated
const LandingPage = dynamic(
  () => import("../components").then((mod) => ({ default: mod.LandingPage })),
  {
    loading: () => null,
  }
);

// Dynamically import the home page if the user is authenticated
const HomePage = dynamic(
  () => import("../components").then((mod) => ({ default: mod.HomePage })),
  {
    loading: () => null,
  }
);

export default function Recipes() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  // Render HomePage for authenticated users, LandingPage otherwise
  return session ? <HomePage /> : <LandingPage />;
}
