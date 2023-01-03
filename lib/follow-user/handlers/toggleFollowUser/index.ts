import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { toggleFollowUserHandlerFactory } from "./factory";
import { logger } from "../../../../logger";

type FollowingUser = { following: User["id"] };
type UnfollowedUser = { unfollowed: User["id"] };
type SomethingWentWrong = { error: string };

type ApiResponse = FollowingUser | UnfollowedUser | SomethingWentWrong;

export type ToggleFollowUserHandler = (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => Promise<void>;

export const toggleFollowUserHandler: ToggleFollowUserHandler = toggleFollowUserHandlerFactory({ getToken, logger });
