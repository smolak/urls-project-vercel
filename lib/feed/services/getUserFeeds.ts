import axios, { AxiosError } from "axios";
import { GetUserFeedsSuccessResponse, GetUserFeedsFailureResponse } from "../handlers/getUserFeeds";

export type GetUserFeedsSuccess = GetUserFeedsSuccessResponse;
export type GetUserFeedsFailure = AxiosError<GetUserFeedsFailureResponse>;

export const getUserFeeds = async () => {
  const { data } = await axios.get<GetUserFeedsSuccess>("/api/user-feed");

  return data;
};
