import type { Session } from "next-auth";
import { getServerSession } from "next-auth/next";

import authOptions from "../auth/[...nextauth]";

import clientPromise from "../../../clients/mongo";

type VisibilityCondition =
  | { isPublic: boolean }
  | { owner: string }
  | { sharedWith: string }
  | { owner: { $in: string[] } };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
    return;
  }

  const client = await clientPromise;
  const db = client.db("dev");
  const session: Session | null = await getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    // Retrieve all recipes that matches whatever is in the search bar
    try {
      const {
        search,
        sortProperty = "createdAt",
        sortDirection = "desc",
        tags,
      } = req.query;

      let query = {};
      const projection = { data: 0 };

      // Build visibility conditions
      const visibilityConditions: VisibilityCondition[] = [
        { isPublic: true }, // Public recipes are always visible
      ];

      if (session?.user?.email && session?.user?.id) {
        visibilityConditions.push(
          { owner: session.user.id as string }, // User's own recipes
          { sharedWith: session.user.email }, // Recipes shared directly
          // Recipes from users who shared their BookCook
          {
            owner: {
              $in: await db
                .collection("users")
                .find({ sharedWithUsers: session.user.id })
                .map((user) => user._id.toString())
                .toArray(),
            },
          }
        );
      }

      // Add search conditions if present
      if (search) {
        query = {
          $and: [
            { $or: visibilityConditions },
            {
              $or: [
                { title: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } },
              ],
            },
          ],
        };
      } else {
        query = { $or: visibilityConditions };
      }

      // Add tags filter if present
      if (tags) {
        const tagsList = Array.isArray(tags) ? tags : [tags];
        query = {
          $and: [query, { tags: { $all: tagsList } }],
        };
      }

      // Validate sorting inputs
      const validProperties = ["createdAt", "title"];
      const validDirections = ["asc", "desc"];

      if (!validProperties.includes(sortProperty)) {
        throw new Error(`Invalid sort property: ${sortProperty}`);
      }

      if (!validDirections.includes(sortDirection)) {
        throw new Error(`Invalid sort direction: ${sortDirection}`);
      }

      // Determine sorting direction (1 for ascending, -1 for descending)
      const direction = sortDirection === "asc" ? 1 : -1;

      const recipes = await db
        .collection("recipes")
        .find(query, { projection })
        .sort({ [sortProperty]: direction })
        .toArray();

      res.status(200).json(recipes);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    // Create a new recipe
    try {
      // Check if the user is authenticated
      if (!session?.user) {
        return res
          .status(401)
          .json({ message: "Unauthorized. Please log in to create a recipe." });
      }

      const { title, data, tags } = req.body;

      // Validate input data
      if (!title) {
        return res.status(400).json({ message: "Title required." });
      }

      const newRecipe = {
        owner: session.user.id,
        sharedWith: [],
        isPublic: false,
        title,
        data,
        tags: tags ?? [],
        createdAt: new Date(),
        emoji: "🍽️",
        imageURL: "",
      };

      const result = await db.collection("recipes").insertOne(newRecipe);

      res.status(201).json({
        message: "Recipe uploaded successfully.",
        recipeId: result.insertedId,
      });
    } catch (error) {
      console.error("Failed to upload recipe:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
