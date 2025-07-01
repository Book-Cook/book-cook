import type { Db, ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";

import { getDb } from "src/utils/db";

import { authOptions } from "../../auth/[...nextauth]";

const ALLOWED_METHODS = ["PATCH"];

interface VisibilityRequest {
  isPublic: boolean;
}

const handlePatchRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
  db: Db,
  session: Session,
  recipeId: string
) => {
  try {
    const { isPublic }: VisibilityRequest = req.body;

    if (typeof isPublic !== "boolean") {
      return res.status(400).json({ message: "isPublic must be a boolean." });
    }

    // Find the recipe and verify ownership
    const recipe = await db.collection("recipes").findOne({
      _id: recipeId as any,
      owner: session.user.id,
    });

    if (!recipe) {
      return res.status(404).json({ 
        message: "Recipe not found or you don't have permission to modify it." 
      });
    }

    // Prepare update data
    const updateData: any = { isPublic };
    
    // Set publishedAt when making public for the first time
    if (isPublic && !recipe.publishedAt) {
      updateData.publishedAt = new Date();
    }
    
    // Remove publishedAt when making private
    if (!isPublic && recipe.publishedAt) {
      updateData.$unset = { publishedAt: "" };
    }

    const result = await db.collection("recipes").updateOne(
      { _id: recipeId as any, owner: session.user.id },
      updateData.$unset ? updateData : { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        message: "Recipe not found or you don't have permission to modify it." 
      });
    }

    res.status(200).json({
      success: true,
      message: `Recipe is now ${isPublic ? "public" : "private"}.`,
      isPublic,
    });
  } catch (error) {
    console.error("Failed to update recipe visibility:", error);
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
        message: "Unauthorized. Please log in to modify recipe visibility." 
      });
    }

    const { id } = req.query;
    
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Recipe ID is required." });
    }

    const db = await getDb();

    if (req.method === "PATCH") {
      await handlePatchRequest(req, res, db, session, id);
    }
  } catch (error) {
    console.error("API handler main error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
}