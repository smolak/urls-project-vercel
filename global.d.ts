import { DefaultUser, DefaultSession } from "next-auth";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  interface User extends DefaultUser {
    role: PrismaUser["role"];
    createdAt: PrismaUser["createdAt"];
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}
