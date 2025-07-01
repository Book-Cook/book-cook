import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";

import { getDb } from "src/utils/db";

import { authOptions } from "../../auth/[...nextauth]";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
    return;
  }

  const session: Session | null = await getServerSession(req, res, authOptions);
  const db = await getDb();

  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    // Retrieve all recipes that the user has added to their collections
    try {
      // Find the user document and project only collections.
      const userDoc = await db
        .collection("collections")
        .findOne(
          { userId: session?.user?.id },
          { projection: { collections: 1, _id: 0 } }
        );

      if (!userDoc || !userDoc.collections || userDoc.collections.length === 0) {
        // Return empty array instead of 404 for better UX
        res.status(200).json([]);
        return;
      }

      // Convert string IDs to ObjectIds
      const objectIds = userDoc.collections.map(
        (id: string) => new ObjectId(id)
      );

      // Query the recipes collection using the $in operator.
      const recipes = await db
        .collection("recipes")
        .find({ _id: { $in: objectIds } })
        .toArray();

      // Add caching headers for better performance
      res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=600');
      res.status(200).json(recipes);
    } catch (error) {
      console.error("Failed to fetch recently viewed recipes:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    // POST
    try {
      const { recipeId } = req.body;

      if (session.user?.id) {
        // Use upsert to create the document if it doesn't exist
        const result = await db.collection("collections").updateOne(
          { userId: session.user.id },
          {
            $addToSet: {
              collections: recipeId, // add the recipeId to the collection
            },
          },
          { upsert: true } // Create document if it doesn't exist
        );

        // Check if we need to remove the recipe (toggle functionality)
        if (!result.upsertedCount && result.modifiedCount === 0) {
          // Recipe was already in collection, remove it (toggle off)
          const removeResult = await db.collection("collections").updateOne(
            { userId: session.user.id },
            {
              $pull: {
                collections: recipeId,
              },
            }
          );
          
          return res.status(200).json({ 
            success: true, 
            action: "removed",
            message: "Recipe removed from collection" 
          });
        }

        return res.status(201).json({ 
          success: true, 
          action: "added",
          message: "Recipe added to collection" 
        });
      }
    } catch (error) {
      console.error("Failed to create collection:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
