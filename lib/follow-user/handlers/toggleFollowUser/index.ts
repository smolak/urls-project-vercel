import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { toggleFollowUserHandlerFactory } from "./factory";
import { logger } from "../../../../logger";
import { ToggleFollowUserPayloadSchema } from "./payload.schema";

type FollowingUser = { following: User["id"] };
type UnfollowedUser = { unfollowed: User["id"] };
type SomethingWentWrong = { error: string };

export type ToggleFollowUserSuccessResponse = FollowingUser | UnfollowedUser;
export type ToggleFollowUserFailureResponse = SomethingWentWrong;
export type ToggleFollowUserResponse = ToggleFollowUserSuccessResponse | ToggleFollowUserFailureResponse;
export type ToggleFollowUserPayload = ToggleFollowUserPayloadSchema;

export type ToggleFollowUserHandler = (
  req: NextApiRequest,
  res: NextApiResponse<ToggleFollowUserResponse>
) => Promise<void>;

export const toggleFollowUserHandler: ToggleFollowUserHandler = toggleFollowUserHandlerFactory({ getToken, logger });
