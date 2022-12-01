import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../prisma/index";
import { User } from "@prisma/client";

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
      const { role } = await prisma.user.findFirstOrThrow({
        where: {
          id: token.sub,
        },
        select: {
          role: true,
        },
      });

      token.role = role;

      return token;
    },
    async session({ session, token, user }) {
      session.user.role = token.role as User["role"];

      return session;
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
};

export default NextAuth(nextAuthOptions);
