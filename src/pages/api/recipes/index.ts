import type { Filter, SortDirection, Db, ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { getDb } from "src/utils/db";
import { authOptions } from "../auth/[...nextauth]";

const getQuerySchema = z.object({
  search: z.string().max(500).optional(),
  sortProperty: z.enum(["createdAt", "title"]).optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  offset: z.string().regex(/^\d+$/).optional(),
});

interface RecipeDocument {
  _id: ObjectId | string;
  owner: string;
  isPublic: boolean;
  title: string;
  data: unknown;
  tags: string[];
  createdAt: Date;
  emoji: string;
  imageURL: string;
}

type VisibilityCondition =
  | { isPublic: boolean }
  | { owner: string }
  | { owner: { $in: string[] } };

const ALLOWED_METHODS = ["GET", "POST"];

const handleGetRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
  db: Db,
  session: Session | null
) => {
  try {
    const parsed = getQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid query parameters." });
    }

    const {
      search,
      sortProperty = "createdAt",
      sortDirection = "desc",
      tags,
      limit = "20",
      offset = "0",
    } = parsed.data;

    const limitNum = parseInt(limit, 10);
    const offsetNum = parseInt(offset, 10);

    if (isNaN(limitNum) || isNaN(offsetNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ message: "Invalid pagination parameters." });
    }

    // 2. Define visibility conditions.
    // My Recipes shows only recipes the user owns or that have been
    // explicitly shared with them — public recipes belong on the Discover page.
    const visibilityConditions: VisibilityCondition[] = [];

    if (session?.user?.id) {
      // Always include the user's own recipes, even if the shared-owners
      // lookup below fails.
      visibilityConditions.push({ owner: session.user.id });

      try {
        // Find users who have explicitly shared their collection with the
        // current user (their document has currentUserEmail in sharedWithUsers).
        const sharedOwners = await db
          .collection("users")
          .find(
            { sharedWithUsers: session.user.email },
            { projection: { _id: 1 } }
          )
          .map((user) => user._id.toString())
          .toArray();

        if (sharedOwners.length > 0) {
          visibilityConditions.push({ owner: { $in: sharedOwners } });
        }
      } catch (dbError) {
        console.error("Error fetching shared owners:", dbError);
        // Own recipes already added above; shared ones are skipped on error.
      }
    }

    // Unauthenticated users have no visibility — return empty rather than
    // passing an invalid `$or: []` to MongoDB.
    if (visibilityConditions.length === 0) {
      return res.status(200).json({ recipes: [], totalCount: 0, hasMore: false });
    }

    // Avoid wrapping a single condition in $or (minor query optimization).
    let query: Filter<RecipeDocument> =
      visibilityConditions.length === 1
        ? visibilityConditions[0]
        : { $or: visibilityConditions };
    const projection = { data: 0 };

    if (search && typeof search === "string" && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      query = {
        $and: [query, { $or: [{ title: searchRegex }, { tags: searchRegex }] }],
      };
    }

    if (tags) {
      const tagsList = (Array.isArray(tags) ? tags : [tags]).filter(
        (tag) => typeof tag === "string" && tag.trim()
      );
      if (tagsList.length > 0) {
        query = { $and: [query, { tags: { $all: tagsList } }] };
      }
    }

    const direction: SortDirection = sortDirection === "asc" ? 1 : -1;

    const recipes = await db
      .collection<RecipeDocument>("recipes")
      .find(query, { projection })
      .sort({ [sortProperty]: direction })
      .skip(offsetNum)
      .limit(limitNum)
      .toArray();

    // Get total count for pagination
    const totalCount = await db
      .collection<RecipeDocument>("recipes")
      .countDocuments(query);

    // Add caching headers for better performance
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json({
      recipes,
      totalCount,
      hasMore: offsetNum + limitNum < totalCount,
    });
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handlePostRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
  db: Db,
  session: Session | null
) => {
  try {
    if (!session?.user?.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Please log in to create a recipe." });
    }

    const { title, data, tags } = req.body;

    const newRecipe = {
      owner: session.user.id,
      isPublic: false,
      title: typeof title === "string" ? title.trim() : "",
      data: data ?? null,
      tags: Array.isArray(tags)
        ? tags.filter((t) => typeof t === "string")
        : [],
      createdAt: new Date(),
      emoji: "🍽️",
      imageURL: "",
    };

    const result = await db.collection("recipes").insertOne(newRecipe);

    res.status(201).json({
      message: "Recipe uploaded successfully.",
      recipeId: result.insertedId,
    });
  } catch (error) {
    console.error("Failed to upload recipe:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.method || !ALLOWED_METHODS.includes(req.method)) {
    res.setHeader("Allow", ALLOWED_METHODS);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
    return;
  }

  try {
    const session: Session | null = await getServerSession(
      req,
      res,
      authOptions
    );
    const db = await getDb();

    if (req.method === "GET") {
      await handleGetRequest(req, res, db, session);
    } else if (req.method === "POST") {
      await handlePostRequest(req, res, db, session);
    }
  } catch (error) {
    console.error("API handler main error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
}
