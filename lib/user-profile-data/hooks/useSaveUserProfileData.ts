import { useMutation } from "@tanstack/react-query";
import {
  saveUserProfileData,
  SaveUserProfileDataError,
  SaveUserProfileDataPayload,
  SaveUserProfileDataSuccess,
} from "../services/saveUserProfileData";

export const useSaveUserProfileData = () =>
  useMutation<SaveUserProfileDataSuccess, SaveUserProfileDataError, SaveUserProfileDataPayload>((userProfileData) =>
    saveUserProfileData(userProfileData)
  );
