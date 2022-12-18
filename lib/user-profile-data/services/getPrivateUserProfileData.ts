import axios, { AxiosError } from "axios";
import {
  GetPrivateUserProfileDataSuccess as Success,
  GetPrivateUserProfileDataFailure as Failure,
} from "../handlers/getPrivateUserProfileDataHandler";

export type GetPrivateUserProfileDataSuccess = Success;
export type GetPrivateUserProfileDataError = AxiosError<Failure>;

export const getPrivateUserProfileData = async () => {
  const { data } = await axios.get<GetPrivateUserProfileDataSuccess>("/api/user-profile-data/private");

  return data;
};
