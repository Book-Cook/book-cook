import clientPromise from "../../../clients/mongo";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("dev");
    const { id } = req.query as { id: string };  // Extract the recipe ID from the query parameters
    // Find the recipe with the given ID
    if (typeof id !== 'string') {
      res.status(400).json({ message: 'Invalid recipe ID' });
      return;
    }

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }
    const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(id) });

    if (recipe) {
      res.status(200).json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    console.error('Failed to retrieve recipe:', error);
    res.status(500).json({ error: 'Failed to load recipe' });
  }
}

