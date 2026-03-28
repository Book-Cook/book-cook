import { http, HttpResponse } from "msw";

import { fetchJson } from "./fetchJson";
import { server } from "../mocks/server";

// Set up test handlers for fetchJson testing
beforeEach(() => {
  // Reset MSW to clean state for each test
  server.resetHandlers();
});

test("returns parsed json when response ok", async () => {
  server.use(
    http.get("/api/test", () => {
      return HttpResponse.json({ foo: "bar" });
    })
  );

  const data = await fetchJson<{ foo: string }>("/api/test");
  expect(data).toEqual({ foo: "bar" });
});

test("returns undefined for ok response with no json", async () => {
  server.use(
    http.get("/api/test", () => {
      return new Response("", { status: 200 });
    })
  );

  const data = await fetchJson("/api/test");
  expect(data).toBeUndefined();
});

test("throws error message from response body when not ok", async () => {
  server.use(
    http.get("/api/test", () => {
      return HttpResponse.json({ message: "Bad request" }, { status: 400 });
    })
  );

  await expect(fetchJson("/api/test")).rejects.toThrow("Bad request");
});

test("throws statusText when body has no message", async () => {
  server.use(
    http.get("/api/test", () => {
      return HttpResponse.json({}, { status: 500, statusText: "Server error" });
    })
  );

  await expect(fetchJson("/api/test")).rejects.toThrow("Server error");
});
