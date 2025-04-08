import clientPromise from "../../../clients/mongo";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import authOptions from "../auth/[...nextauth]";
import type { Session } from "next-auth";
import type { Recipe } from "src/clientToServer";
import type { NextApiRequest, NextApiResponse } from "next";

type UpdateFields = {
  title?: string;
  data?: string;
  tags?: string[];
  imageURL?: string;
  sharedWith?: string[];
  emoji?: string;
  isPublic?: boolean;
};

type ResponseData =
  | {
      message?: string;
      error?: string;
      recipeId?: string;
    }
  | Recipe;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET" && req.method !== "PUT" && req.method !== "DELETE") {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }

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

  // Check if the user can delete the recipe (only the owner can delete)
  const canDelete = async (id: string) => {
    const recipe = await recipesCollection.findOne({
      _id: new ObjectId(id),
      owner: session?.user?.email,
    });

    if (!recipe) {
      res.status(403).json({ message: "Not authorized to delete this recipe" });
      return undefined;
    }
    return recipe;
  };

  // Check if the user can update the recipe
  // (only the owner or a user in the owner's sharedWith list can update)
  const canUpdate = async (id: string) => {
    const recipe = await recipesCollection.findOne({
      _id: new ObjectId(id),
      $or: [
        { owner: session?.user?.email },
        {
          $and: [
            { owner: { $exists: true } },
            {
              owner: {
                $in: await db
                  .collection("users")
                  .find({ sharedWithUsers: session?.user?.email })
                  .map((user) => user.email)
                  .toArray(),
              },
            },
          ],
        },
      ],
    });

    if (!recipe) {
      res.status(403).json({ message: "Not authorized to update this recipe" });
      return undefined;
    }

    return recipe;
  };

  // Check if the user can view the recipe
  // (either public, owned by the user, or shared with the user)
  const canView = async (id: string) => {
    const recipe = await db.collection("recipes").findOne({
      _id: new ObjectId(id),
      $or: [
        { isPublic: true },
        { owner: session?.user?.email },
        { sharedWith: session?.user?.email },
        // Check if the recipe owner has shared their entire BookCook
        {
          $and: [
            { owner: { $exists: true } },
            {
              owner: {
                $in: await db
                  .collection("users")
                  .find({ sharedWithUsers: session?.user?.email })
                  .map((user) => user.email)
                  .toArray(),
              },
            },
          ],
        },
      ],
    });

    if (!recipe) {
      res.status(404).json({ message: "Recipe not found or access denied" });
      return undefined;
    }

    return recipe;
  };

  if (req.method === "GET") {
    // Get a certain recipe
    try {
      // Find the recipe with the given ID
      const recipe = await canView(id);
      if (recipe === undefined) {
        return;
      }

      if (session && session.user?.email) {
        // Update the recently viewed recipes for the user
        // First, remove the recipe id if it exists.
        await db.collection("users").updateOne(
          { email: session.user.email },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { $pull: { recentlyViewedRecipes: new ObjectId(id) as any } }
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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any,
          }
        );
      }

      res.status(200).json(recipe as unknown as Recipe);
    } catch (error) {
      console.error("Failed to retrieve recipe:", error);
      res.status(500).json({ error: "Failed to load recipe" });
    }
  } else if (req.method === "PUT") {
    // Update a specific recipe
    // Sharing, updating tags, and other fields
    try {
      const recipe = await canUpdate(id);
      if (recipe === undefined) {
        return;
      }

      const { title, data, tags, imageURL, shareWithEmail, emoji, isPublic } =
        req.body;
      const setFields: UpdateFields = {};
      const addToSetFields: UpdateFields = {};

      // Fields that use $set
      if (title) setFields.title = title;
      if (data) setFields.data = data;
      if (imageURL) setFields.imageURL = imageURL;
      if (emoji) setFields.emoji = emoji;
      if (isPublic !== undefined) setFields.isPublic = isPublic;

      // Fields that use $addToSet
      if (tags) addToSetFields.tags = { $each: tags } as unknown as string[];
      if (shareWithEmail)
        addToSetFields.sharedWith = {
          $each: [shareWithEmail],
        } as unknown as string[];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateOperation: { $set?: UpdateFields; $addToSet?: UpdateFields } =
        {};
      if (Object.keys(setFields).length > 0) {
        updateOperation.$set = setFields;
      }
      if (Object.keys(addToSetFields).length > 0) {
        updateOperation.$addToSet = addToSetFields;
      }

      const result = await recipesCollection.updateOne(
        { _id: new ObjectId(id) },
        updateOperation
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
  } else {
    // if (req.method === "DELETE")
    // Delete a recipe by ID
    try {
      const recipe = await canDelete(id);
      if (recipe === undefined) {
        return;
      }

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
  }
}
