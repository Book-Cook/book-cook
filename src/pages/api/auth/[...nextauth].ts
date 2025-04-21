import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import clientPromise from "src/clients/mongo";
import "next-auth";

import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process?.env?.GOOGLE_CLIENT_ID as string,
      clientSecret: process?.env?.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session.user?.email) {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const user = await db
          .collection("users")
          .findOne({ email: session.user.email }, { projection: { _id: 1 } });

        if (user?._id) {
          session.user.id = user._id.toString();
        }
      }
      return session;
    },
  },
  events: {
    async signIn(message) {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);
      const users = db.collection("users");

      // Check if a user with this email already exists
      const email = message.user.email;
      const existingUser = await users.findOne({ email });

      if (!existingUser) {
        await users.insertOne({
          email,
          name: message?.user?.name,
          createdAt: new Date(),
          recentlyViewedRecipes: [],
          collections: [],
          sharedWithUsers: [],
        });
      } else if (!existingUser.name && message.user.name) {
        await users.updateOne({ email }, { $set: { name: message.user.name } });
      }
    },
  },
});
