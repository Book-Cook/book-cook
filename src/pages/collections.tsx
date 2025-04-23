import * as React from "react";
import { useSession } from "next-auth/react";

import { useFetchUser } from "src/clientToServer/fetch/useFetchUser";

export default function CollectionsPage() {
  const { data: session, status } = useSession();
  const { user } = useFetchUser(session?.user?.id);

  return (
    <div>
      <h1>Collections</h1>

      {status === "loading" && <p>Loading session...</p>}
      {status === "unauthenticated" && <p>You are not signed in.</p>}

      {status === "authenticated" && (
        <>
          <h2>Your Session Data:</h2>
          <pre>{JSON.stringify(session, null, 2)}</pre>

          <h2>Your User Data:</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
      )}
    </div>
  );
}
