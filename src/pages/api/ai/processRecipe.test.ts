/** @jest-environment node */

import handler from "./processRecipe";

import { processWithAI } from "../../../server";

jest.mock("../../../server", () => ({
  processWithAI: jest.fn(),
}));

describe("/api/ai/processRecipe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("rejects non-POST requests", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { method: "GET" } as any;
    const res = await handler(req);
    const body = await res.json();
    expect(res.status).toBe(405);
    expect(body).toEqual({ message: "Method Not Allowed" });
  });

  test("returns 400 when htmlContent missing", async () => {
    const req = {
      method: "POST",
      json: jest.fn().mockResolvedValue({}),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    const res = await handler(req);
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body).toEqual({
      message: "Missing or invalid htmlContent in request body",
    });
  });

  test("returns processed content on success", async () => {
    const req = {
      method: "POST",
      json: jest.fn().mockResolvedValue({ htmlContent: "<p>hi</p>" }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    (processWithAI as jest.Mock).mockResolvedValue({
      processedContent: "<p>out</p>",
    });

    const res = await handler(req);
    const body = await res.json();

    expect(processWithAI).toHaveBeenCalledWith({
      systemPrompt: expect.any(String),
      userPrompt: "<p>hi</p>",
    });
    expect(res.status).toBe(200);
    expect(body).toEqual({ processedContent: "<p>out</p>" });
  });
});
