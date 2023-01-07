import { useQuery } from "@tanstack/react-query";
import {
  isFollowingUser,
  IsFollowingUserFailure,
  IsFollowingUserPayload,
  IsFollowingUserSuccess,
} from "../services/isFollowingUser";

export const createIsFollowingUserKey = (userId: IsFollowingUserPayload["userId"]) => ["isFollowing", userId];

export const useIsFollowingUser = (payload: IsFollowingUserPayload) =>
  useQuery<IsFollowingUserSuccess, IsFollowingUserFailure>(createIsFollowingUserKey(payload.userId), () =>
    isFollowingUser(payload)
  );
