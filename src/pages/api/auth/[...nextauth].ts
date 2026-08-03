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

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
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
    // Resolve the user id once and cache it on the JWT. `getServerSession` runs
    // these callbacks on every authenticated API request, so looking the user up
    // here instead of in `session` removes a MongoDB round trip from each one.
    async jwt({ token }) {
      if (!token.userId && token.email) {
        try {
          const db = await getDb();
          const user = await db
            .collection("users")
            .findOne({ email: token.email }, { projection: { _id: 1 } });

          // `events.signIn` creates the document *after* this callback first
          // runs, so leave the id unset and retry on the next request rather
          // than caching a miss.
          if (user?._id) {
            token.userId = user._id.toString();
          }
        } catch (error) {
          // A database blip must not throw out of this callback: NextAuth would
          // return an empty session and sign the user out. Keep the token and
          // retry the lookup on the next request instead.
          console.error("Failed to resolve user id for session token:", error);
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId;
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
      let existingUser = await users.findOne({ email });

      if (!existingUser) {
        const result = await users.insertOne({
          email,
          name: message?.user?.name,
          createdAt: new Date(),
          recentlyViewedRecipes: [],
          sharedWithUsers: [],
        });
        existingUser = { _id: result.insertedId, email };
      } else if (!existingUser.name && message.user.name) {
        await users.updateOne({ email }, { $set: { name: message.user.name } });
      }

      // Check if user already has a collections document
      const existingCollection = await collections.findOne({
        userId: existingUser?._id.toString(),
      });

      if (!existingCollection) {
        await collections.insertOne({
          userId: existingUser?._id.toString(),
          collections: [],
        });
      }
    },
  },
};

export default NextAuth(authOptions);
