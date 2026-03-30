jest.mock("../../../../pages/api/auth/[...nextauth]", () => ({ authOptions: {} }));
jest.mock("src/utils/db", () => ({ getDb: jest.fn() }));
jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("mongodb", () => {
  const oid = jest.fn().mockImplementation((id: string) => ({
    toString: () => id ?? "507f1f77bcf86cd799439011",
  }));
  // isValid is called by the handler before constructing an ObjectId
  (oid as unknown as { isValid: () => boolean }).isValid = () => true;
  return { ObjectId: oid };
});

import { getServerSession } from "next-auth";
import { createMocks } from "node-mocks-http";

import { getDb } from "src/utils/db";

import handler from "../../../../pages/api/recipes/[id]/visibility";

const mockGetDb = getDb as jest.MockedFunction<typeof getDb>;
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

const RECIPE_ID = "507f1f77bcf86cd799439011";
const USER_ID = "user-1";

function makeSession() {
  return { user: { id: USER_ID, email: "user@example.com" } } as ReturnType<typeof mockGetServerSession> extends Promise<infer T> ? T : never;
}

function makeDb(recipeOverrides: Record<string, unknown> = {}, updateResult = { matchedCount: 1 }) {
  const updateOne = jest.fn().mockResolvedValue(updateResult);
  const findOne = jest.fn().mockResolvedValue({
    _id: RECIPE_ID,
    owner: USER_ID,
    isPublic: false,
    ...recipeOverrides,
  });
  return {
    db: { collection: jest.fn().mockReturnValue({ findOne, updateOne }) },
    findOne,
    updateOne,
  };
}

describe("PATCH /api/recipes/[id]/visibility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetServerSession.mockResolvedValue(makeSession());
  });

  describe("happy path — making public (no existing publishedAt)", () => {
    it("calls updateOne with $set only (no $unset)", async () => {
      const { db, updateOne } = makeDb({ isPublic: false, publishedAt: null });
      mockGetDb.mockResolvedValue(db as Parameters<typeof mockGetDb>[0]);

      const { req, res } = createMocks({
        method: "PATCH",
        query: { id: RECIPE_ID },
        body: { isPublic: true },
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const [, updateDoc] = updateOne.mock.calls[0] as [unknown, Record<string, unknown>];
      expect(updateDoc).toHaveProperty("$set");
      expect(updateDoc).not.toHaveProperty("$unset");
      expect((updateDoc.$set as Record<string, unknown>).isPublic).toBe(true);
      expect((updateDoc.$set as Record<string, unknown>).publishedAt).toBeInstanceOf(Date);
    });
  });

  describe("happy path — making public again (already has publishedAt)", () => {
    it("does not overwrite publishedAt", async () => {
      const existingDate = new Date("2024-01-01");
      const { db, updateOne } = makeDb({ isPublic: false, publishedAt: existingDate });
      mockGetDb.mockResolvedValue(db as Parameters<typeof mockGetDb>[0]);

      const { req, res } = createMocks({
        method: "PATCH",
        query: { id: RECIPE_ID },
        body: { isPublic: true },
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const [, updateDoc] = updateOne.mock.calls[0] as [unknown, Record<string, unknown>];
      expect((updateDoc.$set as Record<string, unknown>).isPublic).toBe(true);
      expect((updateDoc.$set as Record<string, unknown>).publishedAt).toBeUndefined();
    });
  });

  describe("happy path — making private (has publishedAt) — the previously-broken case", () => {
    it("uses $set + $unset, never mixes bare keys with operators", async () => {
      const { db, updateOne } = makeDb({ isPublic: true, publishedAt: new Date() });
      mockGetDb.mockResolvedValue(db as Parameters<typeof mockGetDb>[0]);

      const { req, res } = createMocks({
        method: "PATCH",
        query: { id: RECIPE_ID },
        body: { isPublic: false },
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const [, updateDoc] = updateOne.mock.calls[0] as [unknown, Record<string, unknown>];

      // Must use $set for isPublic
      expect(updateDoc).toHaveProperty("$set");
      expect((updateDoc.$set as Record<string, unknown>).isPublic).toBe(false);

      // Must use $unset for publishedAt
      expect(updateDoc).toHaveProperty("$unset");
      expect((updateDoc.$unset as Record<string, unknown>).publishedAt).toBeDefined();

      // Must NOT have bare top-level fields that would make the document invalid
      const operatorKeys = Object.keys(updateDoc).filter((k) => !k.startsWith("$"));
      expect(operatorKeys).toHaveLength(0);
    });
  });

  describe("happy path — making private (no publishedAt)", () => {
    it("uses $set only", async () => {
      const { db, updateOne } = makeDb({ isPublic: true, publishedAt: null });
      mockGetDb.mockResolvedValue(db as Parameters<typeof mockGetDb>[0]);

      const { req, res } = createMocks({
        method: "PATCH",
        query: { id: RECIPE_ID },
        body: { isPublic: false },
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const [, updateDoc] = updateOne.mock.calls[0] as [unknown, Record<string, unknown>];
      expect(updateDoc).toHaveProperty("$set");
      expect(updateDoc).not.toHaveProperty("$unset");
    });
  });

  describe("error cases", () => {
    it("returns 401 when not authenticated", async () => {
      mockGetServerSession.mockResolvedValue(null);
      const { req, res } = createMocks({
        method: "PATCH",
        query: { id: RECIPE_ID },
        body: { isPublic: true },
      });
      await handler(req, res);
      expect(res._getStatusCode()).toBe(401);
    });

    it("returns 400 when isPublic is not a boolean", async () => {
      const { db } = makeDb();
      mockGetDb.mockResolvedValue(db as Parameters<typeof mockGetDb>[0]);

      const { req, res } = createMocks({
        method: "PATCH",
        query: { id: RECIPE_ID },
        body: { isPublic: "yes" },
      });
      await handler(req, res);
      expect(res._getStatusCode()).toBe(400);
    });

    it("returns 404 when recipe not found or not owned", async () => {
      const db = { collection: jest.fn().mockReturnValue({ findOne: jest.fn().mockResolvedValue(null) }) };
      mockGetDb.mockResolvedValue(db as Parameters<typeof mockGetDb>[0]);

      const { req, res } = createMocks({
        method: "PATCH",
        query: { id: RECIPE_ID },
        body: { isPublic: true },
      });
      await handler(req, res);
      expect(res._getStatusCode()).toBe(404);
    });

    it("returns 405 for non-PATCH methods", async () => {
      const { req, res } = createMocks({ method: "DELETE", query: { id: RECIPE_ID } });
      await handler(req, res);
      expect(res._getStatusCode()).toBe(405);
    });
  });
});
