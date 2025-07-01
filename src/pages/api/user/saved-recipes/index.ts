import type { Db } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";

import { getDb } from "src/utils/db";

import { authOptions } from "../../auth/[...nextauth]";

const ALLOWED_METHODS = ["GET", "POST"];

interface SavedRecipeRequest {
  recipeId: string;
}

interface SavedRecipeResponse {
  success: boolean;
  action: "saved" | "unsaved";
  message: string;
}

const handleGetRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
  db: Db,
  session: Session
) => {
  try {
    // Get saved recipes with full recipe details
    const pipeline = [
      { $match: { userId: session.user.id } },
      {
        $lookup: {
          from: "recipes",
          localField: "savedRecipes",
          foreignField: "_id",
          as: "recipes",
        },
      },
      {
        $unwind: {
          path: "$recipes",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          "recipes.isPublic": true, // Only return recipes that are still public
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "recipes.owner",
          foreignField: "_id",
          as: "creatorInfo",
        },
      },
      {
        $addFields: {
          "recipes.creatorName": {
            $ifNull: [
              { $arrayElemAt: ["$creatorInfo.name", 0] },
              { $arrayElemAt: ["$creatorInfo.email", 0] },
            ],
          },
        },
      },
      {
        $replaceRoot: { newRoot: "$recipes" },
      },
      {
        $project: {
          data: 0, // Exclude recipe content for performance
          creatorInfo: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ];

    const savedRecipes = await db
      .collection("savedRecipes")
      .aggregate(pipeline)
      .toArray();

    res.status(200).json(savedRecipes);
  } catch (error) {
    console.error("Failed to fetch saved recipes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handlePostRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
  db: Db,
  session: Session
) => {
  try {
    const { recipeId }: SavedRecipeRequest = req.body;

    if (!recipeId || typeof recipeId !== "string") {
      return res.status(400).json({ message: "Recipe ID is required." });
    }

    // Verify the recipe exists and is public
    const recipe = await db.collection("recipes").findOne({
      _id: recipeId as any,
      isPublic: true,
    });

    if (!recipe) {
      return res.status(404).json({ 
        message: "Recipe not found or is not public." 
      });
    }

    // Check if user is trying to save their own recipe
    if (recipe.owner === session.user.id) {
      return res.status(400).json({ 
        message: "You cannot save your own recipe." 
      });
    }

    // Find or create user's saved recipes document
    const existingSavedRecipes = await db.collection("savedRecipes").findOne({
      userId: session.user.id,
    });

    const isAlreadySaved = existingSavedRecipes?.savedRecipes?.includes(recipeId);

    if (isAlreadySaved) {
      // Remove from saved recipes
      await db.collection("savedRecipes").updateOne(
        { userId: session.user.id },
        { $pull: { savedRecipes: recipeId as any } }
      );

      // Decrement saved count on recipe
      await db.collection("recipes").updateOne(
        { _id: recipeId as any },
        { $inc: { savedCount: -1 } }
      );

      const response: SavedRecipeResponse = {
        success: true,
        action: "unsaved",
        message: "Recipe removed from your saved recipes.",
      };

      res.status(200).json(response);
    } else {
      // Add to saved recipes
      await db.collection("savedRecipes").updateOne(
        { userId: session.user.id },
        { $addToSet: { savedRecipes: recipeId } },
        { upsert: true }
      );

      // Increment saved count on recipe
      await db.collection("recipes").updateOne(
        { _id: recipeId as any },
        { $inc: { savedCount: 1 } }
      );

      const response: SavedRecipeResponse = {
        success: true,
        action: "saved",
        message: "Recipe saved to your cookbook.",
      };

      res.status(200).json(response);
    }
  } catch (error) {
    console.error("Failed to save/unsave recipe:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.method || !ALLOWED_METHODS.includes(req.method)) {
    res.setHeader("Allow", ALLOWED_METHODS);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
    return;
  }

  try {
    const session: Session | null = await getServerSession(
      req,
      res,
      authOptions
    );

    if (!session?.user?.id) {
      return res.status(401).json({ 
        message: "Unauthorized. Please log in to save recipes." 
      });
    }

    const db = await getDb();

    if (req.method === "GET") {
      await handleGetRequest(req, res, db, session);
    } else if (req.method === "POST") {
      await handlePostRequest(req, res, db, session);
    }
  } catch (error) {
    console.error("API handler main error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
}