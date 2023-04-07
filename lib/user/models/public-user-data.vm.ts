import { User } from "@prisma/client";

export type PublicUserDataVM = Pick<User, "id" | "name" | "image" | "createdAt">;

export const toPublicUserDataVM = ({ id, name, image, createdAt }: User): PublicUserDataVM => ({
  id,
  name,
  image,
  createdAt,
});
