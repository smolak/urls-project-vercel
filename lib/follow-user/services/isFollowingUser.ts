import axios, { AxiosError } from "axios";
import {
  IsFollowingUserFailureResponse,
  IsFollowingUserPayload as Payload,
  IsFollowingUserSuccessResponse,
} from "../handlers/isFollowingUser";

export type IsFollowingUserSuccess = IsFollowingUserSuccessResponse;
export type IsFollowingUserFailure = AxiosError<IsFollowingUserFailureResponse>;
export type IsFollowingUserPayload = Payload;

export const isFollowingUser = async (payload: IsFollowingUserPayload) => {
  const { data } = await axios.get<IsFollowingUserSuccess>(`/api/follow-user/${payload.userId}`);

  return data;
};
