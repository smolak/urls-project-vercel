import { GetToken } from "../../../auth/models/GetToken";
import { Logger } from "pino";
import { UsernameCheckHandler } from "./index";
import prisma from "../../../../prisma";
import { generateRequestId } from "../../../request-id/utils/generateRequestId";
import { StatusCodes } from "http-status-codes";
import { usernameCheckHandlerPayloadSchema } from "./payload.schema";
import { normalizeUsername } from "../../utils/normalizeUsername";

interface Params {
  getToken: GetToken;
  logger: Logger;
}

type UsernameCheckHandlerFactory = ({ getToken, logger }: Params) => UsernameCheckHandler;

const actionType = "usernameCheck";

export const usernameCheckHandlerFactory: UsernameCheckHandlerFactory =
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

    // Is body payload OK?
    const result = usernameCheckHandlerPayloadSchema.safeParse(req.body);

    if (!result.success) {
      logger.error({ requestId, actionType }, "Body validation error.");

      res.status(StatusCodes.NOT_ACCEPTABLE);
      return;
    }

    const username = result.data.username;
    const usernameNormalized = normalizeUsername(username);

    const match = await prisma.userProfileData.findUnique({
      where: {
        usernameNormalized,
      },
    });
    const usernameAvailable = match === null;

    res.status(200);
    res.json({ usernameAvailable });
  };
