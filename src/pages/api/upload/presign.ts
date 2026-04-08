import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { r2, R2_BUCKET } from "src/lib/r2";
import { getDb } from "src/utils/db";
import { authOptions } from "../auth/[...nextauth]";

import { randomUUID } from "crypto";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const RATE_LIMIT = 20; // max uploads per user per hour
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const bodySchema = z.object({
  fileName: z.string().max(255),
  fileType: z.string().max(100),
  fileSize: z.number().int().positive(),
});

type PresignResponse = { uploadUrl: string; key: string } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PresignResponse>,
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

  const { fileName, fileType, fileSize } = parsed.data;

  if (!ALLOWED_TYPES.has(fileType)) {
    return res
      .status(400)
      .json({ error: "File type not allowed. Use JPEG, PNG, WebP, or GIF." });
  }

  if (fileSize > MAX_SIZE_BYTES) {
    return res
      .status(400)
      .json({ error: "File too large. Maximum size is 10 MB." });
  }

  // Rate limiting via MongoDB TTL collection — auto-cleans after 1 hour
  const db = await getDb();
  const uploadAttempts = db.collection("upload_attempts");

  // Ensure TTL index exists (idempotent — no-op after first creation)
  await uploadAttempts.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 3600, background: true },
  );

  const windowStart = new Date(Date.now() - RATE_WINDOW_MS);
  const recentCount = await uploadAttempts.countDocuments({
    userId: session.user.id,
    createdAt: { $gt: windowStart },
  });

  if (recentCount >= RATE_LIMIT) {
    return res
      .status(429)
      .json({ error: "Too many uploads. Please wait before trying again." });
  }

  await uploadAttempts.insertOne({
    userId: session.user.id,
    createdAt: new Date(),
  });

  // Sanitize extension — strip anything non-alphanumeric
  const rawExt = fileName.split(".").pop() ?? "";
  const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";

  // Key scoped to userId in pending prefix — lifecycle rule deletes after 24h
  const key = `uploads/pending/${session.user.id}/${randomUUID()}.${ext}`;

  const uploadUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: fileType, // Locks Content-Type — R2 rejects mismatches
    }),
    { expiresIn: 60 }, // 60 seconds — short window, not the tutorial default of 3600
  );

  return res.status(200).json({ uploadUrl, key });
}
