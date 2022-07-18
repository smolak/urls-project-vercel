import NextAuth, { NextAuthOptions, User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../prisma/index";
import { createCredentialsProvider } from "../../../lib/auth/createCredentialsProvider";

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.type === "credentials" && user !== undefined) {
        token.role = user.role;
        token.image = user.image;
      }

      return token;
    },
    async session({ session, token, user }) {
      if (token.role) {
        session.user.role = token.role as User["role"];
      }

      if (token.image) {
        session.user.image = token.image as User["image"];
      }

      return session;
    },
  },
  providers: [createCredentialsProvider(prisma, "credentials-login")],
};

export default NextAuth(nextAuthOptions);
