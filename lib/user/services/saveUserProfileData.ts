import axios, { AxiosError } from "axios";
import { UserProfileData } from "@prisma/client";
import { UserProfileDataUpsertSuccess, UserProfileDataUpsertFailure } from "../handlers/userProfileDataUpsertHandler";

export interface SaveUserProfileDataPayload {
  username: UserProfileData["username"];
}

export type SaveUserProfileDataSuccess = UserProfileDataUpsertSuccess;
export type SaveUserProfileDataError = AxiosError<UserProfileDataUpsertFailure>;

export const saveUserProfileData = async (userProfileData: SaveUserProfileDataPayload) => {
  const { data } = await axios.post<UserProfileDataUpsertSuccess>("/api/user-profile-data", userProfileData);

  return data;
};
