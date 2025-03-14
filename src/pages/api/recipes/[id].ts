import clientPromise from "../../../clients/mongo";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import authOptions from "../auth/[...nextauth]";
import type { Session } from "next-auth";

type UpdateFields = {
  title?: string;
  data?: string;
  tags?: string[];
  imageURL?: string;
};

export default async function handler(req: any, res: any) {
  const client = await clientPromise;
  const session: Session | null = await getServerSession(req, res, authOptions);
  const db = client.db("dev");
  const recipesCollection = db.collection("recipes");
  const { id } = req.query as { id: string }; // Extract the recipe ID from the query parameters

  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid recipe ID" });
    return;
  }

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid ID format" });
    return;
  }

  if (req.method === "GET") {
    // Get a certain recipe
    try {
      // Find the recipe with the given ID
      const recipe = await db
        .collection("recipes")
        .findOne({ _id: new ObjectId(id) });

      if (recipe) {
        if (session && session.user?.email) {
          // First, remove the recipe id if it exists.
          await db
            .collection("users")
            .updateOne(
              { email: session.user.email },
              { $pull: { recentlyViewedRecipes: new ObjectId(id) } as any }
            );

          // Then, push the recipe id, keeping only the last 10 items.
          await db.collection("users").updateOne(
            { email: session.user.email },
            {
              $push: {
                recentlyViewedRecipes: {
                  $each: [new ObjectId(id)],
                  $slice: -10, // Keeps only the last 10 items
                },
              } as any,
            }
          );
        }

        res.status(200).json(recipe);
      } else {
        res.status(404).json({ message: "Recipe not found" });
      }
    } catch (error) {
      console.error("Failed to retrieve recipe:", error);
      res.status(500).json({ error: "Failed to load recipe" });
    }
  } else if (req.method === "PUT") {
    // Update a specific recipe
    try {
      const { title, data, tags, imageURL } = req.body;
      const updateFields: UpdateFields = {};

      if (title) updateFields.title = title;
      if (data) updateFields.data = data;
      if (tags) updateFields.tags = tags;
      if (imageURL) updateFields.imageURL = imageURL;

      const result = await recipesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        res.status(404).json({ message: "Recipe not found" });
      } else {
        res.status(200).json({ message: "Recipe updated successfully" });
      }
    } catch (error) {
      console.error("Failed to update recipe:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    // Delete a recipe by ID
    try {
      const result = await recipesCollection.deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        res.status(404).json({ message: "Recipe not found." });
        return;
      }

      res.status(200).json({
        message: "Recipe deleted successfully.",
        recipeId: id,
      });
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    // Error case
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
