import { getMongoClient } from "src/clients/mongo";

export async function getDb() {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB);
}
