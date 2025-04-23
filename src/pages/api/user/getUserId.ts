import { getDb } from "src/utils";

export const getUserId = async (email: string | undefined | null) => {
  const db = await getDb();

  if (email) {
    const user = await db
      .collection("users")
      .findOne({ email }, { projection: { _id: 1 } });
    return user?._id?.toString() ?? "";
  }
};
