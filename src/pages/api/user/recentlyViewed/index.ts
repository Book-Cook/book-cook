import { getServerSession } from "next-auth";
import type { Session } from "next-auth";

import { getDb } from "src/utils/db";

import { authOptions } from "../../auth/[...nextauth]";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== "GET" && req.method !== "DELETE") {
    res.setHeader("Allow", ["GET", "DELETE"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
    return;
  }

  const db = await getDb();
  const session: Session | null = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    if (req.method === "DELETE") {
      // Clear the recentlyViewedRecipes array
      const result = await db
        .collection("users")
        .updateOne(
          { email: session.user?.email },
          { $set: { recentlyViewedRecipes: [] } }
        );

      if (!result.matchedCount) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({ message: "Recently viewed recipes cleared" });
    } else {
      // GET
      // Retrieve all recipes that the user has viewed recently
      const userDoc = await db
        .collection("users")
        .findOne(
          { email: session?.user?.email },
          { projection: { recentlyViewedRecipes: 1, _id: 0 } }
        );

      if (!userDoc || !userDoc.recentlyViewedRecipes) {
        res.status(404).json({ message: "Recently viewed recipes not found" });
        return;
      }

      // Query the recipes collection using the $in operator.
      const recipes = await db
        .collection("recipes")
        .find({ _id: { $in: userDoc.recentlyViewedRecipes } })
        .toArray();

      const orderedRecipes = userDoc.recentlyViewedRecipes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((id: any) =>
          recipes.find((recipe) => recipe._id.toString() === id.toString())
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((recipe: any) => recipe) // remove any null/undefined
        .reverse();

      // Add caching headers for better performance
      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=180');
      res.status(200).json(orderedRecipes);
    }
  } catch (error) {
    console.error("Failed to fetch recently viewed recipes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
