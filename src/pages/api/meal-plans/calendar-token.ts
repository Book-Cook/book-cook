import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";


import { getDb } from "src/utils/db";
import { authOptions } from "../auth/[...nextauth]";

import crypto from "crypto";

const ALLOWED_METHODS = ["GET", "POST", "DELETE"];

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const db = await getDb();
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      { projection: { calendarToken: 1, calendarTokenCreatedAt: 1 } }
    );

    if (!user?.calendarToken) {
      return res.status(404).json({ 
        message: "No calendar token found" 
      });
    }

    const baseUrl = req.headers.host?.includes('localhost') 
      ? `http://${req.headers.host}`
      : `https://${req.headers.host}`;

    res.status(200).json({
      token: user.calendarToken,
      createdAt: user.calendarTokenCreatedAt,
      subscriptionUrl: `${baseUrl}/api/meal-plans/calendar.ics?token=${user.calendarToken}`,
      webcalUrl: `webcal://${req.headers.host}/api/meal-plans/calendar.ics?token=${user.calendarToken}`
    });
  } catch (error) {
    console.error("Failed to get calendar token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const db = await getDb();
    
    // Generate a new secure token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Store/update the token in the user document
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          calendarToken: token,
          calendarTokenCreatedAt: new Date()
        } 
      }
    );

    const baseUrl = req.headers.host?.includes('localhost') 
      ? `http://${req.headers.host}`
      : `https://${req.headers.host}`;

    res.status(201).json({
      token,
      createdAt: new Date(),
      subscriptionUrl: `${baseUrl}/api/meal-plans/calendar.ics?token=${token}`,
      webcalUrl: `webcal://${req.headers.host}/api/meal-plans/calendar.ics?token=${token}`
    });
  } catch (error) {
    console.error("Failed to create calendar token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const db = await getDb();
    
    // Remove the calendar token
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { 
        $unset: { 
          calendarToken: "",
          calendarTokenCreatedAt: ""
        } 
      }
    );

    res.status(200).json({ 
      message: "Calendar token deleted successfully" 
    });
  } catch (error) {
    console.error("Failed to delete calendar token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.method || !ALLOWED_METHODS.includes(req.method)) {
    res.setHeader("Allow", ALLOWED_METHODS);
    return res.status(405).json({ 
      message: `Method ${req.method} not allowed` 
    });
  }

  const session: Session | null = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ 
      message: "Unauthorized. Please log in." 
    });
  }

  switch (req.method) {
    case "GET":
      return handleGet(req, res, session.user.id);
    case "POST":
      return handlePost(req, res, session.user.id);
    case "DELETE":
      return handleDelete(req, res, session.user.id);
    default:
      return res.status(405).json({ 
        message: "Method not allowed" 
      });
  }
}