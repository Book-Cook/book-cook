import { fetchJson } from "src/utils";

export async function deleteSharedUser(
  shareWithEmail: string
): Promise<{ message: string }> {
  return fetchJson("/api/user/sharing", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shareWithEmail }),
  });
}
