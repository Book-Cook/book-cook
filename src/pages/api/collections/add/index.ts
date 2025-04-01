import clientPromise from "src/clients/mongo";
import { getServerSession } from "next-auth/next";
import authOptions from "../../auth/[...nextauth]";
import type { Session } from "next-auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
    return;
  }

  const client = await clientPromise;
  const db = client.db("dev");
  const session: Session | null = await getServerSession(req, res, authOptions);

  try {
    const { recipeId } = req.body;

    if (!session || !session.user?.email) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

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
