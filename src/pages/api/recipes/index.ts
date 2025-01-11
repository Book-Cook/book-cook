import clientPromise from "../../../clients/mongo";
import { ObjectId } from "mongodb";

export default async function handler(req: any, res: any) {

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
    return;
  }

  const client = await clientPromise;
  const db = client.db("dev");

  if (req.method === 'GET') {
    // Retrieve all recipes that matches whatever is in the search bar
    try {
      const { search } = req.query;

      let query = {};
      let projection = { data: 0 };

      if (search) {
        query = {
          $or: [
            { title: { $regex: search, $options: 'i' } }, // Match title
            { tags: { $regex: search, $options: 'i' } }   // Match tags (array of strings)
          ]
        };
      }

      const recipes = await db.collection('recipes').find(query, { projection }).toArray();
      res.status(200).json(recipes);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  else if (req.method === 'POST') {
    // Create a new recipe
    try {
      const { title, data, tags } = req.body;

      // Validate input data
      if (!title || !data) {
        return res.status(400).json({ message: 'Title and data are required.' });
      }

      const newRecipe = {
        title,
        data,
        tags: tags || [],
        createdAt: new Date(),
      };

      const result = await db.collection('recipes').insertOne(newRecipe);

      res.status(201).json({
        message: 'Recipe uploaded successfully.',
        recipeId: result.insertedId,
      });
    } catch (error) {
      console.error('Failed to upload recipe:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

}
