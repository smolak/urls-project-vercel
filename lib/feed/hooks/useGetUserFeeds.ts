import { useQuery } from "@tanstack/react-query";
import { getUserFeeds, GetUserFeedsSuccess, GetUserFeedsFailure } from "../services/getUserFeeds";

export const useGetUserFeeds = () =>
  useQuery<GetUserFeedsSuccess, GetUserFeedsFailure>(["getUserFeeds"], () => getUserFeeds());
