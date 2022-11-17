import NextAuth, { NextAuthOptions, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../prisma/index";

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // session: {
  //   strategy: "jwt",
  // },
  // pages: {
  //   signIn: "/auth/login2",
  // },
  // callbacks: {
  //   async jwt({ token, user, account }) {
  //     if (account?.type === "credentials" && user !== undefined) {
  //       token.role = user.role;
  //       token.image = user.image;
  //     }
  //
  //     return token;
  //   },
  //   async session({ session, token, user }) {
  //     if (token.role) {
  //       session.user.role = token.role as User["role"];
  //     }
  //
  //     if (token.image) {
  //       session.user.image = token.image as User["image"];
  //     }
  //
  //     return session;
  //   },
  // },
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_ID as string,
      clientSecret: process.env.TWITTER_SECRET as string,
      version: "2.0",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
};

export default NextAuth(nextAuthOptions);
