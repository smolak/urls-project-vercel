import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../prisma/index";
import { createCredentialsProvider } from "../../../lib/auth/createCredentialsProvider";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [createCredentialsProvider(prisma, "credentials-login")],
});
