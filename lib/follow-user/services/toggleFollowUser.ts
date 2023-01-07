import axios, { AxiosError } from "axios";
import {
  ToggleFollowUserFailureResponse,
  ToggleFollowUserPayload as Payload,
  ToggleFollowUserSuccessResponse,
} from "../handlers/toggleFollowUser";

export type ToggleFollowUserSuccess = ToggleFollowUserSuccessResponse;
export type ToggleFollowUserFailure = AxiosError<ToggleFollowUserFailureResponse>;
export type ToggleFollowUserPayload = Payload;

export const toggleFollowUser = async (payload: ToggleFollowUserPayload) => {
  const { data } = await axios.post<ToggleFollowUserSuccess>("/api/follow-user", payload);

  return data;
};
