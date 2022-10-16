import { User } from "@prisma/client";

export type PublicUserDataVM = Pick<User, "id" | "name" | "image">;

export const toPublicUserDataVM = ({ id, name, image }: User): PublicUserDataVM => ({ id, name, image });
