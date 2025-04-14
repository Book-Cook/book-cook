import * as React from "react";
import { useFetchUser } from "src/clientToServer/fetch/useFetchUser";

export default function CollectionsPage() {
  const { user } = useFetchUser("67d458c499c6107b077fc18a");

  return (
    <div>
      {JSON.stringify(user)}
      <h1>Collections</h1>
      <p>This is the collections page.</p>
    </div>
  );
}
