import { getServerSession } from "next-auth";
import { createMocks } from "node-mocks-http";

import { getDb } from "src/utils/db";
import handler from "./index";

// Mock dependencies
jest.mock("next-auth");
jest.mock("src/utils/db");

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockGetDb = getDb as jest.MockedFunction<typeof getDb>;

describe("/api/user/saved-recipes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSession = {
    user: { id: "user123", email: "test@example.com" },
  };

  describe("GET", () => {
    it("should return saved recipes for authenticated user", async () => {
      mockGetServerSession.mockResolvedValue(mockSession as any);
      
      const mockDb = {
        collection: jest.fn().mockReturnValue({
          aggregate: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([
              {
                _id: "recipe1",
                title: "Saved Recipe",
                owner: "otheruser",
                tags: ["saved"],
                createdAt: new Date("2024-01-01"),
                emoji: "🍝",
                imageURL: "",
                creatorName: "Jane Doe",
              },
            ]),
          }),
        }),
      };
      mockGetDb.mockResolvedValue(mockDb as any);

      const { req, res } = createMocks({ method: "GET" });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data).toHaveLength(1);
      expect(data[0].title).toBe("Saved Recipe");
    });

    it("should require authentication", async () => {
      mockGetServerSession.mockResolvedValue(null);

      const { req, res } = createMocks({ method: "GET" });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(401);
    });
  });

  describe("POST", () => {
    it("should save a public recipe", async () => {
      mockGetServerSession.mockResolvedValue(mockSession as any);
      
      const mockRecipe = {
        _id: "recipe1",
        owner: "otheruser",
        isPublic: true,
        title: "Public Recipe",
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue({
          findOne: jest.fn()
            .mockResolvedValueOnce(mockRecipe) // First call - find recipe
            .mockResolvedValueOnce(null), // Second call - find existing saved recipes
          updateOne: jest.fn().mockResolvedValue({ acknowledged: true }),
        }),
      };
      mockGetDb.mockResolvedValue(mockDb as any);

      const { req, res } = createMocks({
        method: "POST",
        body: { recipeId: "recipe1" },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.action).toBe("saved");
    });

    it("should unsave an already saved recipe", async () => {
      mockGetServerSession.mockResolvedValue(mockSession as any);
      
      const mockRecipe = {
        _id: "recipe1",
        owner: "otheruser",
        isPublic: true,
        title: "Public Recipe",
      };

      const mockExistingSaved = {
        userId: "user123",
        savedRecipes: ["recipe1"],
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue({
          findOne: jest.fn()
            .mockResolvedValueOnce(mockRecipe) // First call - find recipe
            .mockResolvedValueOnce(mockExistingSaved), // Second call - find existing saved recipes
          updateOne: jest.fn().mockResolvedValue({ acknowledged: true }),
        }),
      };
      mockGetDb.mockResolvedValue(mockDb as any);

      const { req, res } = createMocks({
        method: "POST",
        body: { recipeId: "recipe1" },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.action).toBe("unsaved");
    });

    it("should not allow saving your own recipe", async () => {
      mockGetServerSession.mockResolvedValue(mockSession as any);
      
      const mockRecipe = {
        _id: "recipe1",
        owner: "user123", // Same as session user
        isPublic: true,
        title: "Own Recipe",
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue({
          findOne: jest.fn().mockResolvedValue(mockRecipe),
        }),
      };
      mockGetDb.mockResolvedValue(mockDb as any);

      const { req, res } = createMocks({
        method: "POST",
        body: { recipeId: "recipe1" },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe("You cannot save your own recipe.");
    });

    it("should not allow saving private recipes", async () => {
      mockGetServerSession.mockResolvedValue(mockSession as any);
      
      const mockDb = {
        collection: jest.fn().mockReturnValue({
          findOne: jest.fn().mockResolvedValue(null), // Recipe not found (not public)
        }),
      };
      mockGetDb.mockResolvedValue(mockDb as any);

      const { req, res } = createMocks({
        method: "POST",
        body: { recipeId: "recipe1" },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(404);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe("Recipe not found or is not public.");
    });

    it("should require recipeId", async () => {
      mockGetServerSession.mockResolvedValue(mockSession as any);

      const { req, res } = createMocks({
        method: "POST",
        body: {},
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe("Recipe ID is required.");
    });
  });
});