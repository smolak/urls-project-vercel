import { DefaultUser, DefaultSession } from "next-auth";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  interface SessionUser extends DefaultUser {
    role: PrismaUser["role"];
  }

  interface User extends SessionUser {}

  interface Session extends DefaultSession {
    user: SessionUser;
  }
}
