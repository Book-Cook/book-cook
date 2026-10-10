import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";

import { getDb } from "src/utils/db";

import { authOptions } from "../../auth/[...nextauth]";

type VisibilityCondition = { owner: string } | { owner: { $in: string[] } };

/**
 * GET /api/recipes/tags — every tag across the recipes the user can see on
 * My Recipes (their own plus collections shared with them), sorted. Scoped
 * the same way as GET /api/recipes so the tag filter never offers a tag that
 * matches nothing.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }

  const session: Session | null = await getServerSession(req, res, authOptions);
  if (!session?.user?.id || !session.user.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const db = await getDb();

    const visibilityConditions: VisibilityCondition[] = [
      { owner: session.user.id },
    ];

    try {
      // Owners are stored by user id, so shared collections are matched by
      // the sharing user's _id rather than their email
      const sharedOwners = await db
        .collection("users")
        .find(
          { sharedWithUsers: session.user.email },
          { projection: { _id: 1 } },
        )
        .map((user) => user._id.toString())
        .toArray();

      if (sharedOwners.length > 0) {
        visibilityConditions.push({ owner: { $in: sharedOwners } });
      }
    } catch (dbError) {
      console.error("Error fetching shared owners:", dbError);
      // Own tags are still returned; shared ones are skipped on error.
    }

    const pipeline = [
      { $match: { $or: visibilityConditions } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags" } },
      { $sort: { _id: 1 } },
    ];

    const tagsResult = await db
      .collection("recipes")
      .aggregate(pipeline)
      .toArray();
    const tags = tagsResult.map((tag) => tag._id);

    return res.status(200).json(tags);
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
