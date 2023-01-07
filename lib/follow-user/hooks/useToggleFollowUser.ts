import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  toggleFollowUser,
  ToggleFollowUserFailure,
  ToggleFollowUserPayload,
  ToggleFollowUserSuccess,
} from "../services/toggleFollowUser";

export const useToggleFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation<ToggleFollowUserSuccess, ToggleFollowUserFailure, ToggleFollowUserPayload>({
    mutationFn: toggleFollowUser,
    onSuccess: ({ status, userId }) => {
      const newData: ToggleFollowUserSuccess =
        status === "following"
          ? {
              status: "unfollowed",
              userId,
            }
          : { status: "following", userId };

      queryClient.setQueryData(["isFollowing", userId], newData);
    },
  });
};
