import * as React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export const Unauthorized: React.FC = () => {
  const router = useRouter();
  const { status } = useSession();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  return null;
};
