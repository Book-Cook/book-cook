import { createMocks } from "node-mocks-http";

import handler from "./public";

// Mock the database module completely
jest.mock("src/utils/db", () => ({
  getDb: jest.fn(),
}));

// Mock MongoDB ObjectId
jest.mock("mongodb", () => ({
  ObjectId: jest.fn().mockImplementation((id) => ({
    toString: () => id || "507f1f77bcf86cd799439011",
    toHexString: () => id || "507f1f77bcf86cd799439011",
    equals: jest.fn((other) => id === other.toString()),
  })),
}));

import { getDb } from "src/utils/db";
const mockGetDb = getDb as jest.MockedFunction<typeof getDb>;

describe("/api/recipes/public", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return public recipes with creator information", async () => {
    const mockDb = {
      collection: jest.fn().mockReturnValue({
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            {
              _id: "recipe1",
              title: "Test Recipe",
              owner: "user1",
              tags: ["test"],
              createdAt: "2024-01-01T00:00:00.000Z",
              emoji: "🍕",
              imageURL: "",
              savedCount: 5,
              viewCount: 10,
              creatorName: "John Doe",
            },
          ]),
        }),
        countDocuments: jest.fn().mockResolvedValue(1),
      }),
    };
    mockGetDb.mockResolvedValue(mockDb as any);

    const { req, res } = createMocks({
      method: "GET",
      query: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toEqual({
      recipes: [
        {
          _id: "recipe1",
          title: "Test Recipe",
          owner: "user1",
          tags: ["test"],
          createdAt: "2024-01-01T00:00:00.000Z",
          emoji: "🍕",
          imageURL: "",
          savedCount: 5,
          viewCount: 10,
          creatorName: "John Doe",
        },
      ],
      totalCount: 1,
      hasMore: false,
    });
  });

  it("should handle search parameters", async () => {
    const mockDb = {
      collection: jest.fn().mockReturnValue({
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([]),
        }),
        countDocuments: jest.fn().mockResolvedValue(0),
      }),
    };
    mockGetDb.mockResolvedValue(mockDb as any);

    const { req, res } = createMocks({
      method: "GET",
      query: {
        search: "pizza",
        tags: "italian",
        sortProperty: "savedCount",
        sortDirection: "desc",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(mockDb.collection).toHaveBeenCalledWith("recipes");
  });

  it("should validate sort parameters", async () => {
    const mockDb = {
      collection: jest.fn(),
    };
    mockGetDb.mockResolvedValue(mockDb as any);

    const { req, res } = createMocks({
      method: "GET",
      query: {
        sortProperty: "invalid",
        sortDirection: "invalid",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe("Invalid sorting parameters.");
  });

  it("should validate pagination parameters", async () => {
    const mockDb = {
      collection: jest.fn(),
    };
    mockGetDb.mockResolvedValue(mockDb as any);

    const { req, res } = createMocks({
      method: "GET",
      query: {
        limit: "101", // Over the max limit
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe("Invalid pagination parameters.");
  });

  it("should not allow non-GET methods", async () => {
    const { req, res } = createMocks({
      method: "POST",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});