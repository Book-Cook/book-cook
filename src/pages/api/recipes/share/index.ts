import type { PullOperator } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";

import clientPromise from "../../../../clients/mongo";
import authOptions from "../../auth/[...nextauth]";

type ResponseData = {
  message?: string;
  sharedWithUsers?: string[];
};

type ShareRequestBody = {
  shareWithEmail: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Validate request method
  const allowedMethods = ["GET", "POST", "DELETE"];
  if (!allowedMethods.includes(req.method ?? "")) {
    res.setHeader("Allow", allowedMethods);
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Check authentication
  const session: Session | null = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Connect to database
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const userEmail = session.user.email;

  try {
    // GET - Fetch users who have access
    if (req.method === "GET") {
      const user = await db.collection("users").findOne({ email: userEmail });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        sharedWithUsers: user.sharedWithUsers ?? [],
      });
    }

    // Validate shareWithEmail for POST and DELETE requests
    const { shareWithEmail } = req.body as ShareRequestBody;

    // Email validation
    if (!shareWithEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shareWithEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Prevent sharing with yourself
    if (shareWithEmail.toLowerCase() === userEmail.toLowerCase()) {
      return res.status(400).json({ message: "Cannot share with yourself" });
    }

    // POST - Share recipes with another user
    if (req.method === "POST") {
      // Verify target user exists
      const otherUser = await db.collection("users").findOne({
        email: shareWithEmail,
      });

      if (!otherUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Add user to sharedWithUsers array
      await db
        .collection("users")
        .updateOne(
          { email: userEmail },
          { $addToSet: { sharedWithUsers: shareWithEmail } }
        );

      return res
        .status(200)
        .json({ message: "Recipe book shared successfully" });
    }

    // DELETE - Remove user access
    if (req.method === "DELETE") {
      // Verify the user actually exists in your sharedWithUsers
      const currentUser = await db.collection("users").findOne({
        email: userEmail,
        sharedWithUsers: shareWithEmail,
      });

      if (!currentUser) {
        return res
          .status(404)
          .json({ message: "User not in your shared list" });
      }

      await db.collection("users").updateOne(
        { email: userEmail },
        {
          $pull: {
            sharedWithUsers: shareWithEmail,
          } as PullOperator<Document>,
        }
      );

      return res.status(200).json({ message: "Access removed successfully" });
    }
  } catch (error) {
    console.error(`Failed to ${req.method} shared recipes:`, error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
