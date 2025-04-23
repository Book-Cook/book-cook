import clientPromise from "../../../../clients/mongo";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]";
import type { Session } from "next-auth";
import { ObjectId } from "mongodb";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
    return;
  }

  const session: Session | null = await getServerSession(req, res, authOptions);
  const client = await clientPromise;
  const db = client.db("dev");

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    // Retrieve all recipes that the user has added to their collections
    try {
      // Find the user document and project only collections.
      const userDoc = await db
        .collection("users")
        .findOne(
          { email: session?.user?.email },
          { projection: { collections: 1, _id: 0 } }
        );

      if (!userDoc || !userDoc.collections) {
        res.status(404).json({ message: "Collections not found" });
        return;
      }

      // Convert string IDs to ObjectIds
      const objectIds = userDoc.collections.map(
        (id: string) => new ObjectId(id)
      );

      // Query the recipes collection using the $in operator.
      const recipes = await db
        .collection("recipes")
        .find({
          _id: { $in: objectIds },
        })
        .toArray();

      res.status(200).json(recipes);
    } catch (error) {
      console.error("Failed to fetch recently viewed recipes:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    // POST
    try {
      const { recipeId } = req.body;

      if (session.user?.email) {
        const result = await db.collection("users").updateOne(
          { email: session.user.email },
          {
            $addToSet: {
              collections: recipeId, // add the recipeId to the collection
            },
          }
        );

        if (!result.matchedCount) {
          res.status(404).json({ message: "User not found" });
          return;
        }

        res.status(201).json(result);
      }
    } catch (error) {
      console.error("Failed to create collection:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
