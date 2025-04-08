import { getServerSession } from "next-auth/next";
import authOptions from "../../auth/[...nextauth]";
import clientPromise from "../../../../clients/mongo";
import type { Session } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

type ShareRequestBody = {
  shareWithEmail: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session: Session | null = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { shareWithEmail } = req.body as ShareRequestBody;

  if (!shareWithEmail) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("dev");

    // Verify the shareWithEmail is a valid email
    const otherUser = await db.collection("users").findOne({
      email: shareWithEmail,
    });

    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add user to sharedWithUsers array
    await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $addToSet: {
          sharedWithUsers: shareWithEmail,
        },
      }
    );

    res.status(200).json({ message: "Recipe book shared successfully" });
  } catch (error) {
    console.error("Failed to share recipe book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
