import { UserProfileData } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { userProfileDataUpsertHandlerFactory } from "./factory";
import { logger } from "../../../../logger";
import { getToken } from "next-auth/jwt";

interface SuccessApiResponse {
  userProfileData: UserProfileData;
}

interface ConflictApiResponse {
  reason: string;
}

export type UserProfileDataUpsertSuccess = SuccessApiResponse;
export type UserProfileDataUpsertFailure = ConflictApiResponse;
export type UserProfileDataUpsertResponse = UserProfileDataUpsertSuccess | UserProfileDataUpsertFailure;

export type UserProfileDataUpsertHandler = (
  req: NextApiRequest,
  res: NextApiResponse<UserProfileDataUpsertResponse>
) => Promise<void>;

export const userProfileDataUpsertHandler: UserProfileDataUpsertHandler = userProfileDataUpsertHandlerFactory({
  getToken,
  logger,
});
