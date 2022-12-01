import { DefaultUser, DefaultSession } from "next-auth";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  interface SessionUser extends DefaultUser {
    role: PrismaUser["role"];
  }

  /**
   * @deprecated Don't use, as it might be mistaken for Prisma's User model. Use SessionUser instead.
   */
  interface User extends SessionUser {}

  interface Session extends DefaultSession {
    user: SessionUser;
  }
}
