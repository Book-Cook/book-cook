import type { MongoClientOptions } from "mongodb";
import { MongoClient } from "mongodb";

// Check for MongoDB URI in environment variables
if (
  !process.env.MONGODB_USER ||
  !process.env.MONGODB_PASSWORD ||
  !process.env.MONGODB_CLUSTER ||
  !process.env.MONGODB_DB
) {
  const missingVars = [
    !process.env.MONGODB_USER && "MONGODB_USER",
    !process.env.MONGODB_PASSWORD && "MONGODB_PASSWORD",
    !process.env.MONGODB_CLUSTER && "MONGODB_CLUSTER",
    !process.env.MONGODB_DB && "MONGODB_DB",
  ].filter(Boolean);

  throw new Error(
    `Missing MongoDB environment variables: ${missingVars.join(", ")}. Please add them to .env.local`,
  );
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const username = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const cluster = process.env.MONGODB_CLUSTER;
const dbName = process.env.MONGODB_DB;

// Check if custom URI is provided (best for mobile hotspot compatibility)
const customUri = process.env.MONGODB_URI;

// Primary connection URI (SRV record)
const uri =
  customUri ??
  `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;

// Simplified fallback for mobile hotspots (may not work with Atlas clusters)
const fallbackUri = `mongodb://${username}:${password}@${cluster}:27017/${dbName}?ssl=true&authSource=admin&retryWrites=true&w=majority`;

// Base connection options
const baseOptions: MongoClientOptions = {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  // Serverless runs many short-lived instances; a large pool per instance
  // multiplies into a connection storm against the cluster.
  maxPoolSize: 10,
  // Without this the driver waits out its 30s default before surfacing a
  // transient cluster blip, which is the difference between a slow page and a
  // hung one.
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
  family: 4, // Force IPv4 for mobile hotspot compatibility
  ...(process.env.NODE_ENV === "development" && {
    heartbeatFrequencyMS: 2000,
  }),
};

// SRV-specific options
const srvOptions: MongoClientOptions = {
  ...baseOptions,
  directConnection: false,
  srvMaxHosts: 0,
};

// Direct connection options (no SRV-specific options)
const directOptions: MongoClientOptions = {
  ...baseOptions,
  directConnection: false,
};

// Enhanced connection logic with automatic fallback
async function createMongoConnection(): Promise<MongoClient> {
  let client: MongoClient;

  // If custom URI is provided, use it directly (best for mobile hotspots)
  if (customUri) {
    // Choose appropriate options based on URI type
    const options = customUri.includes("mongodb+srv://")
      ? srvOptions
      : directOptions;

    try {
      client = new MongoClient(customUri, options);
      await client.connect();
      return client;
    } catch (error) {
      console.error("Custom MongoDB URI failed:", error);
      throw new Error(
        `Custom MongoDB connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  try {
    // First try the primary SRV connection
    client = new MongoClient(uri, srvOptions);
    await client.connect();
    return client;
  } catch (error) {
    // The direct fallback targets `cluster:27017`, which an Atlas SRV cluster
    // does not serve. In production it can only burn another timeout, so keep
    // it to development where it exists for mobile-hotspot DNS issues.
    if (process.env.NODE_ENV !== "development") {
      throw error;
    }

    console.warn(
      "Primary MongoDB SRV connection failed, trying direct connection...",
      error,
    );

    try {
      // Fallback to direct connection (no SRV) - may not work with Atlas
      client = new MongoClient(fallbackUri, directOptions);
      await client.connect();
      return client;
    } catch (fallbackError) {
      console.error("Both MongoDB connections failed:", {
        primary: error,
        fallback: fallbackError,
      });
      throw new Error(
        `MongoDB connection failed. For mobile hotspots, try setting MONGODB_URI in .env with your Atlas connection string: ${fallbackError instanceof Error ? fallbackError.message : "Unknown error"}`,
      );
    }
  }
}

function connect(): Promise<MongoClient> {
  // A rejected promise stays cached for the life of the instance, so a single
  // transient failure would break every later request. Evict it instead.
  const pending = createMongoConnection().catch((error) => {
    if (global._mongoClientPromise === pending) {
      global._mongoClientPromise = undefined;
    }
    throw error;
  });
  return pending;
}

/**
 * Always read the client through this. It re-reads the cache, so a connection
 * evicted after a failure is retried instead of returning the rejected promise
 * forever.
 */
export function getMongoClient(): Promise<MongoClient> {
  // Cached on `global` in every environment: it survives dev hot-reloads, and in
  // production it stops a second module instance from opening a second pool.
  global._mongoClientPromise ??= connect();
  return global._mongoClientPromise;
}

// Start connecting at import time so the handshake overlaps with module
// evaluation rather than blocking the first query.
void getMongoClient().catch(() => {
  // Swallowed here; callers surface the failure. Prevents an unhandled
  // rejection when nothing has awaited the client yet.
});
