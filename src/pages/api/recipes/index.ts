import clientPromise from "../../../clients/mongo";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
    return;
  }

  const client = await clientPromise;
  const db = client.db("dev");

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

      if (search) {
        query = {
          $or: [
            { title: { $regex: search, $options: "i" } }, // Match title
            { tags: { $regex: search, $options: "i" } }, // Match tags (array of strings)
          ],
        };
      }

      if (tags) {
        const tagsList = Array.isArray(tags) ? tags : [tags];

        if (Object.keys(query).length > 0) {
          query = {
            $and: [query, { tags: { $all: tagsList } }],
          };
        } else {
          query = { tags: { $all: tagsList } };
        }
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
      const { title, data, tags } = req.body;

      // Validate input data
      if (!title) {
        return res.status(400).json({ message: "Title required." });
      }

      const newRecipe = {
        title,
        data,
        tags: tags || [],
        createdAt: new Date(),
        emoji: "",
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
