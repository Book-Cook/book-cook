import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";

import { getDb } from "src/utils";
import { authOptions } from "../auth/[...nextauth]";

import clientPromise from "../../../clients/mongo";

type ResponseData = { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session: Session | null = await getServerSession(req, res, authOptions);

  if (!session?.user?.id || !session?.user?.email) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const client = await clientPromise;
    const db = await getDb();

    // Start a session for transaction
    const mongoSession = client.startSession();

    try {
      await mongoSession.withTransaction(async () => {
        // Delete all recipes owned by the user
        await db
          .collection("recipes")
          .deleteMany({ owner: session?.user?.id }, { session: mongoSession });

        // Remove user from any sharedWithUsers arrays
        await db.collection("users").updateMany(
          { sharedWithUsers: session.user?.email },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { $pull: { sharedWithUsers: session?.user?.email } } as any,
          { session: mongoSession }
        );

        // Delete the user document
        const result = await db
          .collection("users")
          .deleteOne({ email: session.user?.email }, { session: mongoSession });

        if (!result.deletedCount) {
          throw new Error("User not found");
        }
      });

      // Sign out the user (client-side will need to handle this)
      res.status(200).json({ message: "Account deleted successfully" });
    } finally {
      await mongoSession.endSession();
    }
  } catch (error) {
    console.error("Failed to delete account:", error);
    res.status(500).json({ message: "Failed to delete account" });
  }
}
