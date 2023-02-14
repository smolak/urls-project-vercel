import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "../../../../logger";
import { getUserFeedsHandlerFactory } from "./factory";
import { getToken } from "next-auth/jwt";
import { FeedVM } from "../../models/Feed.vm";

export type GetUserFeedsSuccessResponse = {
  feeds: ReadonlyArray<FeedVM>;
};
export type GetUserFeedsFailureResponse = { error: string };
export type GetUserFeedsResponse = GetUserFeedsSuccessResponse | GetUserFeedsFailureResponse;

export type GetUserFeedsHandler = (req: NextApiRequest, res: NextApiResponse<GetUserFeedsResponse>) => Promise<void>;

export const getUserFeedsHandler: GetUserFeedsHandler = getUserFeedsHandlerFactory({
  logger,
  getToken,
});
