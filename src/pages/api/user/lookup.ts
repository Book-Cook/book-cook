import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { getDb } from "src/utils/db";
import { authOptions } from "../auth/[...nextauth]";

type ResponseData = { name?: string; error?: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify the user is authenticated
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { userId } = req.query;
  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "UserId parameter is required" });
  }

  try {
    let objectId;
    try {
      objectId = new ObjectId(userId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const db = await getDb();

    const user = await db
      .collection("users")
      .findOne(
        { _id: objectId },
        { projection: { name: 1, email: 1, _id: 1 } }
      );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ name: user.name });
  } catch (error) {
    console.error("Error looking up user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
