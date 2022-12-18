import { useQuery } from "@tanstack/react-query";
import {
  getPrivateUserProfileData,
  GetPrivateUserProfileDataError,
  GetPrivateUserProfileDataSuccess,
} from "../services/getPrivateUserProfileData";

export const useGetPrivateUserProfileData = () =>
  useQuery<GetPrivateUserProfileDataSuccess, GetPrivateUserProfileDataError>(["privateUserProfile"], () =>
    getPrivateUserProfileData()
  );
