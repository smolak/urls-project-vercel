import { UserProfileData } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { userProfileDataUpsertHandlerFactory } from "./factory";
import { logger } from "../../../../logger";
import { getToken } from "next-auth/jwt";

interface ApiResponse {
  userProfileData: UserProfileData;
}

export type UserProfileDataUpsertHandler = (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => Promise<void>;

export const userProfileDataUpsertHandler: UserProfileDataUpsertHandler = userProfileDataUpsertHandlerFactory({
  getToken,
  logger,
});
