import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { db } from "~/server/db";

/**
 * Extend NextAuth session types
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

/**
 * NextAuth configuration
 */
export const authConfig = {

  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          throw new Error("User not found");
        }

        if (!user.password) {
          throw new Error("Password not set");
        }

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!valid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },

  jwt: {
    maxAge: 60 * 60 * 24,
  },

  callbacks: {
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub!;

        const latestUser = await db.user.findUnique({
          where: { id: token.sub! },
          select: {
            name: true,
            email: true,
            image: true,
            role: true,
          },
        });

        if (latestUser) {
          session.user.name = latestUser.name;
          session.user.email = latestUser.email ?? "";
          session.user.image = latestUser.image;
          session.user.role = latestUser.role;
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/student/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;