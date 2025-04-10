import type { MongoClientOptions } from "mongodb";
import { MongoClient } from "mongodb";

// Check for MongoDB URI in environment variables
if (!process.env.MONGODB_URI) {
  throw new Error(
    "Missing MONGODB_URI environment variable. Please add it to .env.local"
  );
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri: string = process.env.MONGODB_URI;

// MongoDB connection options with better error handling
const options: MongoClientOptions = {
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 50,
  retryWrites: true,
};

let clientPromise: Promise<MongoClient>;

try {
  if (process.env.NODE_ENV === "development") {
    // In development, use a global variable to preserve the connection across hot-reloads
    if (!global._mongoClientPromise) {
      console.log("Creating new MongoDB connection in development");
      global._mongoClientPromise = new MongoClient(uri, options).connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production, create a new connection
    clientPromise = new MongoClient(uri, options).connect();
  }
} catch (error) {
  console.error("MongoDB connection error:", error);
  throw new Error("Failed to establish MongoDB connection");
}

export default clientPromise;
