import { UserProfileData } from "@prisma/client";

export type PrivateUserProfileDataVm = Pick<UserProfileData, "id" | "apiKey" | "username">;

export const toPrivateUserProfileDataVM = ({ id, apiKey, username }: UserProfileData): PrivateUserProfileDataVm => {
  return { id, apiKey, username };
};
