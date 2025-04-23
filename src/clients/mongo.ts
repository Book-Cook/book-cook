import type { MongoClientOptions } from "mongodb";
import { MongoClient } from "mongodb";

// Check for MongoDB URI in environment variables
if (
  !process.env.MONGODB_USER ||
  !process.env.MONGODB_PASSWORD ||
  !process.env.MONGODB_CLUSTER ||
  !process.env.MONGODB_DB
) {
  throw new Error(
    "Missing MONGO_DB environment variable. Please add it to .env.local"
  );
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const username = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const cluster = process.env.MONGODB_CLUSTER;
const dbName = process.env.MONGODB_DB;

const uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;

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
    global._mongoClientPromise ??= new MongoClient(uri, options).connect();
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
