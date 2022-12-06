import axios from "axios";
import { UserProfileData } from "@prisma/client";

export interface SaveUserProfileDataPayload {
  username: UserProfileData["username"];
}

export const saveUserProfileData = async (userProfileData: SaveUserProfileDataPayload) => {
  const { data } = await axios.post<UserProfileData>("/api/user-profile-data", userProfileData);

  return data;
};
