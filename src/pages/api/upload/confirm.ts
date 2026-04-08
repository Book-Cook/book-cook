import {
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { r2, R2_BUCKET, R2_PUBLIC_URL } from "src/lib/r2";
import { getDb } from "src/utils/db";
import { authOptions } from "../auth/[...nextauth]";

const bodySchema = z.object({
  key: z.string().min(1).max(500),
  recipeId: z.string().regex(/^[a-f\d]{24}$/i),
});

type ConfirmResponse = { url: string } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ConfirmResponse>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { key, recipeId } = parsed.data;

  // Key must belong to this user — prevents confirming another user's pending upload
  const expectedPrefix = `uploads/pending/${session.user.id}/`;
  if (!key.startsWith(expectedPrefix)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Verify the file actually landed in R2 before moving it
  try {
    await r2.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
  } catch {
    return res
      .status(400)
      .json({ error: "Upload not found in storage. Please try again." });
  }

  // Move pending → public (copy then delete)
  const publicKey = key.replace("uploads/pending/", "uploads/public/");

  await r2.send(
    new CopyObjectCommand({
      Bucket: R2_BUCKET,
      CopySource: `${R2_BUCKET}/${key}`,
      Key: publicKey,
    }),
  );

  await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));

  // Update the recipe in MongoDB — only the recipe owner may change the cover
  const db = await getDb();
  const imageURL = `${R2_PUBLIC_URL}/${publicKey}`;

  const result = await db
    .collection("recipes")
    .updateOne(
      { _id: new ObjectId(recipeId), owner: session.user.id },
      { $set: { imageURL } },
    );

  if (result.matchedCount === 0) {
    // File already moved to public/ — log for manual cleanup if needed
    return res
      .status(404)
      .json({ error: "Recipe not found or you are not the owner." });
  }

  return res.status(200).json({ url: imageURL });
}
