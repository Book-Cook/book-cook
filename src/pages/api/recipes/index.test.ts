/** @jest-environment node */

jest.mock("../auth/[...nextauth]", () => ({ authOptions: {} }));
jest.mock("src/utils/db", () => ({ getDb: jest.fn() }));
jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));

import { getServerSession } from "next-auth";

import { getDb } from "src/utils/db";
import handler from "./index";

const mockRes = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

// Helpers shared across GET tests
function makeGetReq(query: Record<string, string> = {}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { method: "GET", query: { sortProperty: "createdAt", sortDirection: "desc", ...query } } as any;
}

function makeCursor(docs: unknown[]) {
  return {
    find: jest.fn().mockReturnThis(),
    map: jest.fn().mockImplementation((fn: (d: unknown) => unknown) => ({
      toArray: jest.fn().mockResolvedValue(docs.map(fn)),
    })),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    toArray: jest.fn().mockResolvedValue(docs),
  };
}

describe("/api/recipes", () => {
  test("GET unauthenticated returns empty list (no public bleed-through)", async () => {
    const req = makeGetReq();
    const res = mockRes();
    (getServerSession as jest.Mock).mockResolvedValue(null);

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ recipes: [], totalCount: 0, hasMore: false });
  });

  test("GET authenticated with no shared users returns only own recipes", async () => {
    const req = makeGetReq();
    const res = mockRes();
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "user1", email: "user1@test.com" } });

    const recipeDocs = [{ _id: "r1", owner: "user1", title: "My Recipe", tags: [], isPublic: false }];
    const userCursor = makeCursor([]); // no shared owners
    const recipeCursor = makeCursor(recipeDocs);
    const countDocuments = jest.fn().mockResolvedValue(1);

    const db = {
      collection: jest.fn().mockImplementation((name: string) => {
        if (name === "users") {
          return { find: jest.fn().mockReturnValue(userCursor) };
        }
        return {
          find: jest.fn().mockReturnValue(recipeCursor),
          countDocuments,
        };
      }),
    };
    (getDb as jest.Mock).mockResolvedValue(db);

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const response = (res.json as jest.Mock).mock.calls[0][0];
    expect(response.recipes).toEqual(recipeDocs);
    expect(response.totalCount).toBe(1);
  });

  test("GET authenticated includes shared owners' recipes", async () => {
    const req = makeGetReq();
    const res = mockRes();
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "user1", email: "user1@test.com" } });

    // user2 has shared with user1
    const userCursor = {
      map: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue(["user2"]) }),
    };
    const recipeDocs = [
      { _id: "r1", owner: "user1", title: "My Recipe", tags: [], isPublic: false },
      { _id: "r2", owner: "user2", title: "Shared Recipe", tags: [], isPublic: false },
    ];
    const recipeCursor = makeCursor(recipeDocs);
    const countDocuments = jest.fn().mockResolvedValue(2);

    const db = {
      collection: jest.fn().mockImplementation((name: string) => {
        if (name === "users") {
          return { find: jest.fn().mockReturnValue(userCursor) };
        }
        return {
          find: jest.fn().mockReturnValue(recipeCursor),
          countDocuments,
        };
      }),
    };
    (getDb as jest.Mock).mockResolvedValue(db);

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const response = (res.json as jest.Mock).mock.calls[0][0];
    expect(response.totalCount).toBe(2);
  });

  test("GET still returns own recipes when sharedOwners lookup throws", async () => {
    const req = makeGetReq();
    const res = mockRes();
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "user1", email: "user1@test.com" } });

    const recipeDocs = [{ _id: "r1", owner: "user1", title: "My Recipe", tags: [], isPublic: false }];
    const recipeCursor = makeCursor(recipeDocs);
    const countDocuments = jest.fn().mockResolvedValue(1);

    const db = {
      collection: jest.fn().mockImplementation((name: string) => {
        if (name === "users") {
          // Simulate DB error on sharedOwners lookup
          return {
            find: jest.fn().mockReturnValue({
              map: jest.fn().mockReturnValue({
                toArray: jest.fn().mockRejectedValue(new Error("DB timeout")),
              }),
            }),
          };
        }
        return {
          find: jest.fn().mockReturnValue(recipeCursor),
          countDocuments,
        };
      }),
    };
    (getDb as jest.Mock).mockResolvedValue(db);

    await handler(req, res);

    // Should still succeed and return own recipes
    expect(res.status).toHaveBeenCalledWith(200);
    const response = (res.json as jest.Mock).mock.calls[0][0];
    expect(response.recipes).toEqual(recipeDocs);
  });

  test("GET invalid sort parameter returns 400", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { method: "GET", query: { sortProperty: "invalid" } } as any;
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid sorting parameters.",
    });
  });

  test("POST without session returns 401", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { method: "POST", body: { title: "Test" } } as any;
    const res = mockRes();

    (getServerSession as jest.Mock).mockResolvedValue(null);

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("POST with session inserts recipe", async () => {
    const req = {
      method: "POST",
      body: { title: "Title", data: {}, tags: [] },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    const res = mockRes();

    const insertOne = jest.fn().mockResolvedValue({ insertedId: "123" });
    const db = { collection: jest.fn().mockReturnValue({ insertOne }) };
    (getDb as jest.Mock).mockResolvedValue(db);
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user1" },
    });

    await handler(req, res);

    expect(insertOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Recipe uploaded successfully.",
      recipeId: "123",
    });
  });
});
