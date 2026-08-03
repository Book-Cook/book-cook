import * as React from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

import styles from "./meal-plan.module.css";
import { Unauthorized } from "../components/FallbackScreens";
import { Spinner } from "../components/Spinner";

const MealPlanCalendar = dynamic(
  () =>
    import("../components/MealPlan/MealPlanCalendar/MealPlanCalendar").then(
      (mod) => mod.MealPlanCalendar,
    ),
  {
    loading: () => <Spinner size="large" />,
    ssr: false,
  },
);

export default function MealPlanPage() {
  const { data: session, status } = useSession();

  // Treating "still resolving" as unauthorized rendered nothing at all for a
  // whole auth round trip. Only a settled unauthenticated session redirects.
  if (status !== "loading" && !session) {
    return <Unauthorized />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <MealPlanCalendar />
      </div>
    </div>
  );
}
