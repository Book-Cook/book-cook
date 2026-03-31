import type { NextApiRequest, NextApiResponse } from "next";

jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(jest.fn()),
  getServerSession: jest.fn(),
}));
jest.mock("src/pages/api/auth/[...nextauth]", () => ({ authOptions: {} }));
jest.mock("src/utils/db", () => ({ getDb: jest.fn() }));
jest.mock("src/lib/r2", () => ({
  r2: { send: jest.fn() },
  R2_BUCKET: "test-bucket",
  R2_PUBLIC_URL: "https://pub-abc.r2.dev",
}));
jest.mock("@aws-sdk/client-s3", () => ({
  HeadObjectCommand: jest
    .fn()
    .mockImplementation((i) => ({ _type: "HeadObject", ...i })),
  CopyObjectCommand: jest
    .fn()
    .mockImplementation((i) => ({ _type: "CopyObject", ...i })),
  DeleteObjectCommand: jest
    .fn()
    .mockImplementation((i) => ({ _type: "DeleteObject", ...i })),
}));

import { getServerSession } from "next-auth";

import { r2 } from "src/lib/r2";
import { getDb } from "src/utils/db";

import handler from "../confirm";

const mockGetServerSession = getServerSession as jest.Mock;
const mockGetDb = getDb as jest.Mock;
// eslint-disable-next-line @typescript-eslint/unbound-method
const mockR2Send = r2.send as jest.Mock;

const mockSession = { user: { id: "user123", email: "test@test.com" } };
const validKey = "uploads/pending/user123/abc-123.jpg";
const validRecipeId = "6507a5a5a5a5a5a5a5a5a5a5";

function makeReq(overrides: Partial<NextApiRequest> = {}): NextApiRequest {
  return {
    method: "POST",
    body: { key: validKey, recipeId: validRecipeId },
    ...overrides,
  } as unknown as NextApiRequest;
}

function makeRes() {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  return { res: { status, json } as unknown as NextApiResponse, json, status };
}

function makeDb(matchedCount = 1) {
  const collection = {
    updateOne: jest.fn().mockResolvedValue({ matchedCount }),
  };
  return { collection: jest.fn().mockReturnValue(collection) };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockGetServerSession.mockResolvedValue(mockSession);
  mockGetDb.mockResolvedValue(makeDb());
  mockR2Send.mockResolvedValue({}); // All R2 calls succeed by default
});

describe("POST /api/upload/confirm", () => {
  it("rejects non-POST methods", async () => {
    const { res, status } = makeRes();
    await handler(makeReq({ method: "GET" }), res);
    expect(status).toHaveBeenCalledWith(405);
  });

  it("rejects unauthenticated requests", async () => {
    mockGetServerSession.mockResolvedValue(null);
    const { res, status } = makeRes();
    await handler(makeReq(), res);
    expect(status).toHaveBeenCalledWith(401);
  });

  it("rejects invalid request body", async () => {
    const { res, status } = makeRes();
    await handler(makeReq({ body: { key: validKey } }), res); // missing recipeId
    expect(status).toHaveBeenCalledWith(400);
  });

  it("rejects keys not belonging to the authenticated user", async () => {
    const { res, status } = makeRes();
    await handler(
      makeReq({
        body: {
          key: "uploads/pending/otheruser/file.jpg",
          recipeId: validRecipeId,
        },
      }),
      res,
    );
    expect(status).toHaveBeenCalledWith(403);
  });

  it("rejects invalid recipe ID format", async () => {
    const { res, status } = makeRes();
    await handler(
      makeReq({ body: { key: validKey, recipeId: "not-an-object-id" } }),
      res,
    );
    expect(status).toHaveBeenCalledWith(400);
  });

  it("returns 400 if the file is not found in R2", async () => {
    mockR2Send.mockRejectedValueOnce(new Error("NoSuchKey"));
    const { res, status } = makeRes();
    await handler(makeReq(), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("returns 404 if recipe not found or user is not owner", async () => {
    mockGetDb.mockResolvedValue(makeDb(0)); // matchedCount = 0
    const { res, status } = makeRes();
    await handler(makeReq(), res);
    expect(status).toHaveBeenCalledWith(404);
  });

  it("copies file from pending to public in R2", async () => {
    const { res } = makeRes();
    await handler(makeReq(), res);

    const calls = mockR2Send.mock.calls.map((c) => c[0]);
    const copyCall = calls.find((c) => c._type === "CopyObject");
    expect(copyCall).toBeDefined();
    expect(copyCall.Key).toBe("uploads/public/user123/abc-123.jpg");
  });

  it("deletes the pending file after copying", async () => {
    const { res } = makeRes();
    await handler(makeReq(), res);

    const calls = mockR2Send.mock.calls.map((c) => c[0]);
    const deleteCall = calls.find((c) => c._type === "DeleteObject");
    expect(deleteCall).toBeDefined();
    expect(deleteCall.Key).toBe(validKey);
  });

  it("returns the public URL on success", async () => {
    const { res, status, json } = makeRes();
    await handler(makeReq(), res);
    expect(status).toHaveBeenCalledWith(200);
    const payload = json.mock.calls[0][0] as { url: string };
    expect(payload.url).toContain("uploads/public/user123/abc-123.jpg");
    expect(payload.url).toContain("https://pub-abc.r2.dev");
  });

  it("updates the recipe imageURL in the database", async () => {
    const db = makeDb();
    mockGetDb.mockResolvedValue(db);
    const { res } = makeRes();
    await handler(makeReq(), res);

    const collection = db.collection("recipes");
    expect(collection.updateOne).toHaveBeenCalledWith(
      expect.objectContaining({ owner: "user123" }),
      expect.objectContaining({
        $set: expect.objectContaining({
          imageURL: expect.stringContaining("uploads/public/"),
        }),
      }),
    );
  });
});
