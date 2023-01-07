import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  toggleFollowUser,
  ToggleFollowUserFailure,
  ToggleFollowUserPayload,
  ToggleFollowUserSuccess,
} from "../services/toggleFollowUser";
import { createIsFollowingUserKey } from "./useIsFollowingUser";

export const useToggleFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation<ToggleFollowUserSuccess, ToggleFollowUserFailure, ToggleFollowUserPayload>({
    mutationFn: toggleFollowUser,
    onSuccess: ({ userId }) => {
      queryClient.setQueryData(createIsFollowingUserKey(userId), ({ isFollowing }) => ({
        isFollowing: !isFollowing,
      }));
    },
  });
};
