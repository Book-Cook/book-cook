import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]";
import { getDb } from "../../../utils";

const extractIngredients = (markdown: string): string[] => {
  const sectionMatch = /#+\s*ingredients\s*\n([\s\S]*?)(?:\n#+\s*|$)/i.exec(
    markdown
  );
  if (!sectionMatch) {
    return [];
  }
  return sectionMatch[1]
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => /^(-|\*|\d+\.)\s+/.test(line))
    .map((line) => line.replace(/^(-|\*|\d+\.)\s+/, "").toLowerCase());
};

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

    const recipes = await db.collection("recipes").find(query).toArray();

    const userIngredients = ingredients.map((i) => i.toLowerCase());

    const matches = recipes.filter((r) => {
      const ingList = extractIngredients(r.data ?? "");
      return ingList.length > 0 && ingList.every((ri) =>
        userIngredients.some((ui) => new RegExp(`\\b${ui}\\b`, "i").test(ri))
      );
    });

    const simplified = matches.slice(0, 5).map(({ _id, title }) => ({ _id, title }));

    res.status(200).json({ recipes: simplified });
  } catch (error) {
    console.error("[Suggest Recipes Error]", error);
    const message = error instanceof Error ? error.message : "Internal Error";
    res.status(500).json({ message: `Error fetching recipes: ${message}` });
  }
}
