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
    `Missing MongoDB environment variables: ${missingVars.join(", ")}. Please add them to .env.local`
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
const uri = customUri || `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;

// Simplified fallback for mobile hotspots (may not work with Atlas clusters)
const fallbackUri = `mongodb://${username}:${password}@${cluster}:27017/${dbName}?ssl=true&authSource=admin&retryWrites=true&w=majority`;

// Base connection options
const baseOptions: MongoClientOptions = {
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 50,
  retryWrites: true,
  family: 4, // Force IPv4 for mobile hotspot compatibility
  ...(process.env.NODE_ENV === "development" && {
    serverSelectionTimeoutMS: 5000,
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

let clientPromise: Promise<MongoClient>;

// Enhanced connection logic with automatic fallback
async function createMongoConnection(): Promise<MongoClient> {
  let client: MongoClient;
  
  console.log('MongoDB connection debug:', {
    hasCustomUri: Boolean(customUri),
    customUriStart: `${customUri?.substring(0, 20)  }...`,
  });
  
  // If custom URI is provided, use it directly (best for mobile hotspots)
  if (customUri) {
    console.log('Using custom MongoDB URI:', `${customUri.substring(0, 30)  }...`);
    
    // Choose appropriate options based on URI type
    const options = customUri.includes('mongodb+srv://') ? srvOptions : directOptions;
    
    try {
      client = new MongoClient(customUri, options);
      await client.connect();
      console.log('Custom MongoDB connection successful');
      return client;
    } catch (error) {
      console.error('Custom MongoDB URI failed:', error);
      throw new Error(`Custom MongoDB connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  try {
    // First try the primary SRV connection
    console.log('Attempting primary MongoDB SRV connection...');
    client = new MongoClient(uri, srvOptions);
    await client.connect();
    console.log('Primary MongoDB SRV connection successful');
    return client;
  } catch (error) {
    console.warn('Primary MongoDB SRV connection failed, trying direct connection...', error);
    
    try {
      // Fallback to direct connection (no SRV) - may not work with Atlas
      console.log('Attempting fallback direct connection...');
      client = new MongoClient(fallbackUri, directOptions);
      await client.connect();
      console.log('Fallback MongoDB direct connection successful');
      return client;
    } catch (fallbackError) {
      console.error('Both MongoDB connections failed:', {
        primary: error,
        fallback: fallbackError
      });
      throw new Error(`MongoDB connection failed. For mobile hotspots, try setting MONGODB_URI in .env with your Atlas connection string: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
    }
  }
}

try {
  if (process.env.NODE_ENV === "development") {
    // In development, use a global variable to preserve the connection across hot-reloads
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = createMongoConnection();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production, create a new connection
    clientPromise = createMongoConnection();
  }
} catch (error) {
  console.error("MongoDB connection initialization error:", error);
  throw new Error("Failed to initialize MongoDB connection");
}

export default clientPromise;
