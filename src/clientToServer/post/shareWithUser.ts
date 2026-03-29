import { fetchJson } from "src/utils";

export async function shareWithUser(
  shareWithEmail: string
): Promise<{ message: string }> {
  return fetchJson("/api/user/sharing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shareWithEmail }),
  });
}
