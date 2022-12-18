import { NextApiRequest, NextApiResponse } from "next";
import { getPrivateUserProfileDataHandlerFactory } from "./factory";
import { getToken } from "next-auth/jwt";
import { logger } from "../../../../logger";
import { PrivateUserProfileDataVm } from "../../models/PrivateUserProfileData.vm";

interface NotFoundResponse {
  message: string;
}

export type GetPrivateUserProfileDataSuccess = PrivateUserProfileDataVm;
export type GetPrivateUserProfileDataFailure = NotFoundResponse;
export type GetPrivateUserProfileDataResponse = GetPrivateUserProfileDataSuccess | GetPrivateUserProfileDataFailure;

export type GetPrivateUserProfileDataHandler = (
  req: NextApiRequest,
  res: NextApiResponse<GetPrivateUserProfileDataResponse>
) => Promise<void>;

export const getPrivateUserProfileDataHandler: GetPrivateUserProfileDataHandler =
  getPrivateUserProfileDataHandlerFactory({
    getToken,
    logger,
  });
