import NextAuth, { NextAuthOptions } from "next-auth";
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
  providers: [createCredentialsProvider(prisma, "credentials-login")],
};

export default NextAuth(nextAuthOptions);
