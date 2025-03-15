import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri: string = process.env.MONGODB_URI as string;

const clientPromise =
  global._mongoClientPromise || new MongoClient(uri).connect();

if (process?.env?.NODE_ENV === "development") {
  // In development, store the promise globally to prevent multiple connections
  global._mongoClientPromise = clientPromise;
}

export default clientPromise;
