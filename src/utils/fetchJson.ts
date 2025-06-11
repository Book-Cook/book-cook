export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = undefined;
  }
  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? (data as { message?: string }).message
        : response.statusText;
    throw new Error(message || "Network response was not ok");
  }
  return data as T;
}
