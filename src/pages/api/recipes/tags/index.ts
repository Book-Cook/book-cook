import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";

import { getDb } from "src/utils";
import { authOptions } from "../../auth/[...nextauth]";

type StringOrInQuery = string | { $in: string[] };

type VisibilityCondition =
  | { isPublic: boolean }
  | { owner: StringOrInQuery }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }

  const session: Session | null = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const db = await getDb();

    const visibilityConditions: VisibilityCondition[] = [
      { isPublic: true }, // Public recipes are always visible
      { owner: session.user.id as string }, // User's own recipes
    ];

    const sharedUsers = await db
      .collection("users")
      .find({ sharedWithUsers: session.user.email })
      .map((user) => user.email)
      .toArray();

    if (sharedUsers.length > 0) {
      visibilityConditions.push({ owner: { $in: sharedUsers } });
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
