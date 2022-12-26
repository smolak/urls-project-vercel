import { Prisma } from "@prisma/client";

export const PUBLIC_USER_DATA_SELECT_FRAGMENT: Prisma.UserSelect = {
  id: true,
  createdAt: true,
  image: true,
  name: true,
};
