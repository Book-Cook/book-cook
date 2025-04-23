import type { Filter, SortDirection, Db, ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";

import { getDb } from "src/utils";
import { authOptions } from "../auth/[...nextauth]";

interface RecipeDocument {
  _id: ObjectId | string;
  owner: string;
  sharedWith: string[];
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
  | { sharedWith: string }
  | { owner: { $in: string[] } };

const ALLOWED_METHODS = ["GET", "POST"];
const VALID_SORT_PROPERTIES = ["createdAt", "title"];
const VALID_SORT_DIRECTIONS = ["asc", "desc"];

const handleGetRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
  db: Db,
  session: Session | null
) => {
  try {
    const {
      search,
      sortProperty = "createdAt",
      sortDirection = "desc",
      tags,
    } = req.query as {
      search?: string;
      sortProperty?: string;
      sortDirection?: string;
      tags?: string | string[];
    };

    if (
      typeof sortProperty !== "string" ||
      !VALID_SORT_PROPERTIES.includes(sortProperty) ||
      typeof sortDirection !== "string" ||
      !VALID_SORT_DIRECTIONS.includes(sortDirection)
    ) {
      return res.status(400).json({ message: "Invalid sorting parameters." });
    }

    const visibilityConditions: VisibilityCondition[] = [{ isPublic: true }];

    if (session?.user?.email && session?.user?.id) {
      try {
        const sharedOwners = await db
          .collection("users")
          .find(
            { sharedWithUsers: session.user.id },
            { projection: { _id: 1 } }
          )
          .map((user) => user._id.toString())
          .toArray();

        visibilityConditions.push(
          { owner: session.user.id },
          { sharedWith: session.user.email },
          { owner: { $in: sharedOwners } }
        );
      } catch (dbError) {
        console.error("Error fetching shared owners:", dbError);
      }
    }

    let query: Filter<RecipeDocument> = { $or: visibilityConditions };
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
      .toArray();

    res.status(200).json(recipes);
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

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title required." });
    }

    const newRecipe = {
      owner: session.user.id,
      sharedWith: [],
      isPublic: false,
      title: title.trim(),
      data: data ?? null,
      tags: Array.isArray(tags)
        ? tags.filter((t) => typeof t === "string")
        : [],
      createdAt: new Date(),
      emoji: "🍽️",
      imageURL: "",
    };

    const result = await db.collection("recipes").insertOne(newRecipe);

    res
      .status(201)
      .json({
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
