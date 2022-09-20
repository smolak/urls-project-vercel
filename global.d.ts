import { DefaultUser, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    role: "user" | "admin";
    createdAt: string;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}
