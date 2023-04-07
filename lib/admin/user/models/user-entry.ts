import { User } from "@prisma/client";

export type UserEntry = Pick<User, "id" | "createdAt" | "updatedAt" | "name" | "email" | "role" | "image">;
