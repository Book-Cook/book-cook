import type { Filter, SortDirection, Db } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { getDb } from "src/utils/db";

interface PublicRecipeDocument {
  _id: string;
  owner: string;
  title: string;
  tags: string[];
  createdAt: Date;
  emoji: string;
  imageURL: string;
  savedCount?: number;
  viewCount?: number;
  publishedAt?: Date;
}

interface PublicRecipeWithCreator extends PublicRecipeDocument {
  creatorName: string;
}

const ALLOWED_METHODS = ["GET"];
const VALID_SORT_PROPERTIES = ["createdAt", "savedCount", "viewCount", "title"];
const VALID_SORT_DIRECTIONS = ["asc", "desc"];

const handleGetRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
  db: Db
) => {
  try {
    const {
      search,
      sortProperty = "createdAt",
      sortDirection = "desc",
      tags,
      limit = "20",
      offset = "0",
    } = req.query;

    // Validate query parameters
    if (
      typeof sortProperty !== "string" ||
      !VALID_SORT_PROPERTIES.includes(sortProperty) ||
      typeof sortDirection !== "string" ||
      !VALID_SORT_DIRECTIONS.includes(sortDirection)
    ) {
      return res.status(400).json({ message: "Invalid sorting parameters." });
    }

    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);

    if (isNaN(limitNum) || isNaN(offsetNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ message: "Invalid pagination parameters." });
    }

    // Base query for public recipes only
    let query: Filter<PublicRecipeDocument> = { isPublic: true };

    // Add search functionality
    if (search && typeof search === "string" && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      query = {
        $and: [
          query,
          { $or: [{ title: searchRegex }, { tags: searchRegex }] }
        ],
      };
    }

    // Add tag filtering
    if (tags) {
      const tagsList = (Array.isArray(tags) ? tags : [tags]).filter(
        (tag) => typeof tag === "string" && tag.trim()
      );
      if (tagsList.length > 0) {
        query = { $and: [query, { tags: { $in: tagsList } }] };
      }
    }

    const direction: SortDirection = sortDirection === "asc" ? 1 : -1;

    // Aggregate to get creator information
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "creatorInfo",
        },
      },
      {
        $addFields: {
          creatorName: {
            $ifNull: [
              { $arrayElemAt: ["$creatorInfo.name", 0] },
              { $arrayElemAt: ["$creatorInfo.email", 0] },
            ],
          },
          savedCount: { $ifNull: ["$savedCount", 0] },
          viewCount: { $ifNull: ["$viewCount", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          owner: 1,
          title: 1,
          tags: 1,
          createdAt: 1,
          emoji: 1,
          imageURL: 1,
          savedCount: 1,
          viewCount: 1,
          publishedAt: 1,
          creatorName: 1,
        },
      },
      { $sort: { [sortProperty]: direction } },
      { $skip: offsetNum },
      { $limit: limitNum },
    ];

    const recipes = await db
      .collection<PublicRecipeDocument>("recipes")
      .aggregate<PublicRecipeWithCreator>(pipeline)
      .toArray();

    // Get total count for pagination
    const totalCount = await db
      .collection<PublicRecipeDocument>("recipes")
      .countDocuments(query);

    // Add caching headers for better performance
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.status(200).json({
      recipes,
      totalCount,
      hasMore: offsetNum + limitNum < totalCount,
    });
  } catch (error) {
    console.error("Failed to fetch public recipes:", error);
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
    const db = await getDb();

    if (req.method === "GET") {
      await handleGetRequest(req, res, db);
    }
  } catch (error) {
    console.error("API handler main error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
}