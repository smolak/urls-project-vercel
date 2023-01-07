import { useQuery } from "@tanstack/react-query";
import {
  isFollowingUser,
  IsFollowingUserFailure,
  IsFollowingUserPayload,
  IsFollowingUserSuccess,
} from "../services/isFollowingUser";

export const useIsFollowingUser = (payload: IsFollowingUserPayload) =>
  useQuery<IsFollowingUserSuccess, IsFollowingUserFailure>(["isFollowing", payload.userId], () =>
    isFollowingUser(payload)
  );
