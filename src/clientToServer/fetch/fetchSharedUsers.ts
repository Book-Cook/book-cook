import { fetchJson } from "src/utils";

export async function fetchSharedUsers(): Promise<string[]> {
  const data = await fetchJson<{ sharedWithUsers?: string[] }>(
    "/api/user/sharing",
    {
      method: "GET",
    }
  );
  return data.sharedWithUsers ?? [];
}
