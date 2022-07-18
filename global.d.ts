import "jest-extended";
import { DefaultUser, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    role: "user" | "admin";
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}
