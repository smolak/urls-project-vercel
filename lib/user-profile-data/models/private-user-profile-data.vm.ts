import { UserProfileData } from "@prisma/client";

export type PrivateUserProfileDataVM = Pick<UserProfileData, "id" | "apiKey" | "username">;

export const toPrivateUserProfileDataVM = ({ id, apiKey, username }: UserProfileData): PrivateUserProfileDataVM => {
  return { id, apiKey, username };
};
