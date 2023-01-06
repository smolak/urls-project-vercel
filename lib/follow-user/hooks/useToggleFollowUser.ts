import { useMutation } from "@tanstack/react-query";
import {
  toggleFollowUser,
  ToggleFollowUserFailure,
  ToggleFollowUserPayload,
  ToggleFollowUserSuccess,
} from "../services/toggleFollowUser";

export const useToggleFollowUser = () =>
  useMutation<ToggleFollowUserSuccess, ToggleFollowUserFailure, ToggleFollowUserPayload>((payload) =>
    toggleFollowUser(payload)
  );
