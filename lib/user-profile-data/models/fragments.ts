import { Prisma } from "@prisma/client";

export const PUBLIC_USER_PROFILE_DATA_SELECT_FRAGMENT: Prisma.UserProfileDataSelect = {
  username: true,
};