import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "~/server/db";

export const { handlers, auth } = NextAuth({
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

        if (!user) throw new Error("User not found");
        if (!user.password) throw new Error("Password not set");

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!valid) throw new Error("Invalid password");

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/student/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export const { GET, POST } = handlers;