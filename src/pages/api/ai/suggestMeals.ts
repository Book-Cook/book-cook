import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]";
import { getDb } from "../../../utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const { ingredients } = req.body;

    if (!Array.isArray(ingredients) || !ingredients.every((i) => typeof i === "string")) {
      res.status(400).json({ message: "Missing or invalid ingredients in request body" });
      return;
    }

    const session = await getServerSession(req, res, authOptions);
    const db = await getDb();

    const visibilityConditions: any[] = [{ isPublic: true }];

    if (session?.user?.id) {
      try {
        const sharedOwners = await db
          .collection("users")
          .find({ sharedWithUsers: session.user.email }, { projection: { _id: 1 } })
          .map((u) => u._id.toString())
          .toArray();

        visibilityConditions.push({ owner: session.user.id }, { owner: { $in: sharedOwners } });
      } catch (dbError) {
        console.error("Error fetching shared owners:", dbError);
      }
    }

    const regexes = ingredients
      .filter((i) => i && typeof i === "string")
      .map((i) => new RegExp(i.trim(), "i"));

    let query: any = { $or: visibilityConditions };

    if (regexes.length > 0) {
      const searchConditions = regexes.flatMap((r) => [
        { title: { $regex: r } },
        { tags: { $regex: r } },
      ]);
      query = { $and: [query, { $or: searchConditions }] };
    }

    const recipes = await db
      .collection("recipes")
      .find(query, { projection: { data: 0 } })
      .limit(5)
      .toArray();

    res.status(200).json({ recipes });
  } catch (error) {
    console.error("[Suggest Recipes Error]", error);
    const message = error instanceof Error ? error.message : "Internal Error";
    res.status(500).json({ message: `Error fetching recipes: ${message}` });
  }
}
