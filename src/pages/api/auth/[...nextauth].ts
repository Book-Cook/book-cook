import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { getDb } from "src/utils/db";

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

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session.user?.email) {
        const db = await getDb();
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
      const db = await getDb();
      const users = db.collection("users");
      const collections = db.collection("collections");

      const email = message.user.email;
      const existingUser = await users.findOne({ email });

      if (!existingUser) {
        await users.insertOne({
          email,
          name: message?.user?.name,
          createdAt: new Date(),
          recentlyViewedRecipes: [],
          sharedWithUsers: [],
        });
      } else if (!existingUser.name && message.user.name) {
        await users.updateOne({ email }, { $set: { name: message.user.name } });
      }

      await collections.insertOne({
        userId: existingUser?._id,
        collections: [],
      });
    },
  },
};

export default NextAuth(authOptions);
