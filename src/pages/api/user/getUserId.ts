import clientPromise from "../../../clients/mongo";

export const getUserId = async (email: string | undefined | null) => {
  const client = await clientPromise;
  const db = client.db("dev");

  if (email) {
    const user = await db
      .collection("users")
      .findOne({ email }, { projection: { _id: 1 } });
    return user?._id?.toString() || "";
  }
};
