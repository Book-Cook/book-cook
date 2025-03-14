import clientPromise from "../../../clients/mongo";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import authOptions from "../auth/[...nextauth]";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
    return;
  }

  const client = await clientPromise;
  const db = client.db("dev");

  // Retrieve all recipes that the user has viewed recently
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Find the user document and project only recentlyViewedRecipes.
    const userDoc = await db.collection("users").findOne(
      { email: session.user?.email },
      { projection: { recentlyViewedRecipes: 1, _id: 0 } }
    );

    if (!userDoc || !userDoc.recentlyViewedRecipes) {
      res.status(404).json({ message: "Recently viewed recipes not found" });
      return;
    }

    // Query the recipes collection using the $in operator.
    const recipes = await db.collection("recipes").find({
      _id: { $in: userDoc.recentlyViewedRecipes }
    }).toArray();

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Failed to fetch recently viewed recipes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
