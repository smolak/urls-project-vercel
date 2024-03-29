import { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../prisma";

import GithubProvider from "next-auth/providers/github";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
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
    async jwt({ token }) {
      const { role } = await prisma.user.findFirstOrThrow({
        where: {
          id: token.sub,
        },
        select: {
          role: true,
        },
      });

      token.role = role;
      token.id = token.sub;

      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.role = token.role as User["role"];
        session.user.id = token.id as User["id"];
      }

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

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, nextAuthOptions);
};
