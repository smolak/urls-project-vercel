import { DefaultUser, DefaultSession } from "next-auth";
import { User as PrismaUser, UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User extends DefaultUser {
    role: UserRole;
    createdAt: PrismaUser["createdAt"];
  }

  interface Session {
    user: Pick<User, "role"> & DefaultSession["user"];
  }
}
