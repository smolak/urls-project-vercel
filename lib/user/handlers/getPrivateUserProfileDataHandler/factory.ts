import { GetToken } from "../../../auth/models/GetToken";
import { Logger } from "pino";
import { GetPrivateUserProfileDataHandler } from "./index";
import prisma from "../../../../prisma";
import { generateRequestId } from "../../../shared/utils/generateRequestId";
import { StatusCodes } from "http-status-codes";
import { toPrivateUserProfileDataVM } from "../../models/PrivateUserProfileData.vm";

interface Params {
  getToken: GetToken;
  logger: Logger;
}

type GetPrivateUserProfileDataHandlerFactory = ({ getToken, logger }: Params) => GetPrivateUserProfileDataHandler;

const actionType = "getPrivateUserProfileData";

export const getPrivateUserProfileDataHandlerFactory: GetPrivateUserProfileDataHandlerFactory =
  ({ getToken, logger }) =>
  async (req, res) => {
    const token = await getToken({ req });
    const requestId = generateRequestId();

    logger.info({ requestId, actionType });

    if (!token) {
      logger.warn({ requestId, actionType }, "Not logged in.");

      res.status(StatusCodes.FORBIDDEN);
      return;
    }

    const userId = token.sub as string;
    const maybeUserProfileData = await prisma.userProfileData.findUnique({
      where: {
        userId,
      },
    });

    if (maybeUserProfileData === null) {
      res.status(StatusCodes.NOT_FOUND);
      res.json({ message: "Data not found" });

      return;
    }

    res.status(StatusCodes.OK);
    res.json(toPrivateUserProfileDataVM(maybeUserProfileData));
  };
