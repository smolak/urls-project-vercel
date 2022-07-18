import CredentialsProvider from "next-auth/providers/credentials";
import { hashPassword, verifyPassword } from "./passwords";
import { PrismaClient } from "../../prisma";

export const createCredentialsProvider = (dbAdapter: PrismaClient, providerId: string) =>
  CredentialsProvider({
    id: providerId,
    name: "App Login",
    credentials: {
      email: {},
      password: {},
    },
    async authorize(credentials) {
      try {
        if (!credentials?.password || !credentials?.email) {
          throw new Error("entry:Invalid credentials.");
        }

        let maybeUser = await dbAdapter.user.findFirst({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            email: true,
            password: true,
            name: true,
            role: true,
            image: true,
          },
        });

        if (!maybeUser) {
          maybeUser = await dbAdapter.user.create({
            data: {
              id: "anything-will-be-added-by-middleware",
              email: credentials?.email,
              password: await hashPassword(credentials.password),
            },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              role: true,
              image: true,
            },
          });
        } else {
          const isValid = await verifyPassword(maybeUser.password as string, credentials.password);

          if (!isValid) {
            throw new Error("login:Invalid credentials.");
          }
        }

        return {
          id: maybeUser.id,
          email: maybeUser.email,
          name: maybeUser.name,
          role: maybeUser.role,
          image: maybeUser.image,
        };
      } catch (error) {
        console.log(error);

        throw error;
      }
    },
  });
