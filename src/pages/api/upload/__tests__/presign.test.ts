// Mock dependencies before importing the handler
jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(jest.fn()),
  getServerSession: jest.fn(),
}));
// Mock the auth module so NextAuth() call at module level is skipped
jest.mock("src/pages/api/auth/[...nextauth]", () => ({ authOptions: {} }));
jest.mock("src/utils/db", () => ({ getDb: jest.fn() }));
jest.mock("src/lib/r2", () => ({
  r2: {},
  R2_BUCKET: "test-bucket",
}));
jest.mock("@aws-sdk/client-s3", () => ({
  PutObjectCommand: jest.fn().mockImplementation((input) => ({ input })),
}));
jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest
    .fn()
    .mockResolvedValue("https://r2.example.com/signed-url"),
}));

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { getDb } from "src/utils/db";
import handler from "../presign";

const mockGetServerSession = getServerSession as jest.Mock;
const mockGetDb = getDb as jest.Mock;

const mockSession = { user: { id: "user123", email: "test@test.com" } };

function makeReq(overrides: Partial<NextApiRequest> = {}): NextApiRequest {
  return {
    method: "POST",
    body: {
      fileName: "photo.jpg",
      fileType: "image/jpeg",
      fileSize: 1024 * 500, // 500 KB
    },
    ...overrides,
  } as unknown as NextApiRequest;
}

function makeRes(): {
  res: NextApiResponse;
  json: jest.Mock;
  status: jest.Mock;
} {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const res = { status, json } as unknown as NextApiResponse;
  return { res, json, status };
}

function makeDb(recentCount = 0) {
  const collection = {
    createIndex: jest.fn().mockResolvedValue(undefined),
    countDocuments: jest.fn().mockResolvedValue(recentCount),
    insertOne: jest.fn().mockResolvedValue({ insertedId: "abc" }),
  };
  return { collection: jest.fn().mockReturnValue(collection) };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockGetServerSession.mockResolvedValue(mockSession);
  mockGetDb.mockResolvedValue(makeDb());
});

describe("POST /api/upload/presign", () => {
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

  it("rejects disallowed file types", async () => {
    const { res, status } = makeRes();
    await handler(
      makeReq({
        body: {
          fileName: "doc.pdf",
          fileType: "application/pdf",
          fileSize: 1000,
        },
      }),
      res,
    );
    expect(status).toHaveBeenCalledWith(400);
  });

  it("rejects files over 10 MB", async () => {
    const { res, status } = makeRes();
    await handler(
      makeReq({
        body: {
          fileName: "big.jpg",
          fileType: "image/jpeg",
          fileSize: 11 * 1024 * 1024,
        },
      }),
      res,
    );
    expect(status).toHaveBeenCalledWith(400);
  });

  it("rejects invalid request body", async () => {
    const { res, status } = makeRes();
    await handler(makeReq({ body: { foo: "bar" } }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("returns 429 when rate limit is exceeded", async () => {
    mockGetDb.mockResolvedValue(makeDb(20)); // Already at limit
    const { res, status } = makeRes();
    await handler(makeReq(), res);
    expect(status).toHaveBeenCalledWith(429);
  });

  it("returns uploadUrl and key for valid requests", async () => {
    const { res, status, json } = makeRes();
    await handler(makeReq(), res);
    expect(status).toHaveBeenCalledWith(200);
    const payload = json.mock.calls[0][0] as { uploadUrl: string; key: string };
    expect(payload.uploadUrl).toBe("https://r2.example.com/signed-url");
    expect(payload.key).toMatch(/^uploads\/pending\/user123\/.+\.jpg$/);
  });

  it("scopes the key to the authenticated user", async () => {
    const { res, json } = makeRes();
    await handler(makeReq(), res);
    const payload = json.mock.calls[0][0] as { key: string };
    expect(payload.key).toContain("uploads/pending/user123/");
  });

  it("logs an upload attempt to the rate-limit collection", async () => {
    const db = makeDb();
    mockGetDb.mockResolvedValue(db);
    const { res } = makeRes();
    await handler(makeReq(), res);
    const collection = db.collection("upload_attempts");
    expect(collection.insertOne).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user123" }),
    );
  });

  it("accepts all supported image types", async () => {
    for (const fileType of [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ]) {
      const { res, status } = makeRes();
      await handler(
        makeReq({ body: { fileName: "img.jpg", fileType, fileSize: 1000 } }),
        res,
      );
      expect(status).toHaveBeenCalledWith(200);
    }
  });
});
