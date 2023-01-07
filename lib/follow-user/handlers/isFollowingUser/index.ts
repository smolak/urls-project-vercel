import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

import { isFollowingUserHandlerFactory } from "./factory";
import { logger } from "../../../../logger";
import { IsFollowingUserPayloadSchema } from "./payload.schema";

export type IsFollowingUserSuccessResponse = { isFollowing: boolean };
export type IsFollowingUserFailureResponse = { error: string };
export type IsFollowingUserResponse = IsFollowingUserSuccessResponse | IsFollowingUserFailureResponse;
export type IsFollowingUserPayload = IsFollowingUserPayloadSchema;

export type IsFollowingUserHandler = (
  req: NextApiRequest,
  res: NextApiResponse<IsFollowingUserResponse>
) => Promise<void>;

export const isFollowingUserHandler: IsFollowingUserHandler = isFollowingUserHandlerFactory({ getToken, logger });
