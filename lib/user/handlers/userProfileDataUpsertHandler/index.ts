import { UserProfileData } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { userProfileDataUpsertHandlerFactory } from "./factory";
import { logger } from "../../../../logger";
import { getToken } from "next-auth/jwt";

interface SuccessApiResponse {
  userProfileData: UserProfileData;
}

export interface ConflictApiResponse {
  reason: string;
}

export type UserProfileDataUpsertHandler = (
  req: NextApiRequest,
  res: NextApiResponse<SuccessApiResponse | ConflictApiResponse>
) => Promise<void>;

export const userProfileDataUpsertHandler: UserProfileDataUpsertHandler = userProfileDataUpsertHandlerFactory({
  getToken,
  logger,
});
