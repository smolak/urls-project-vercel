import { GetToken } from "../../../auth/models/GetToken";
import { Logger } from "pino";
import { UserProfileDataUpsertHandler } from "./index";
import { generateRequestId } from "../../../shared/utils/generateRequestId";
import { StatusCodes } from "http-status-codes";
import { userProfileDataUpsertPayloadSchema } from "./payload.schema";
import prisma from "../../../../prisma";
import { normalizeUsername } from "../../utils/normalizeUsername";
import { ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR } from "../../../../prisma/middlewares/generateModelId";

interface Params {
  getToken: GetToken;
  logger: Logger;
}

type UserProfileDataUpsertHandlerFactory = ({ getToken, logger }: Params) => UserProfileDataUpsertHandler;

const actionType = "userProfileDataUpsert";

export const userProfileDataUpsertHandlerFactory: UserProfileDataUpsertHandlerFactory =
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

    const result = userProfileDataUpsertPayloadSchema.safeParse(req.body);

    if (!result.success) {
      logger.error({ requestId, actionType }, "Body validation error.");

      res.status(StatusCodes.NOT_ACCEPTABLE);
      return;
    }

    const username = result.data.username;
    const userId = token.sub as string;

    const updateData = {
      apiKey: "", // empty for now
    };
    const createData = {
      apiKey: "", // empty for now
      username,
      usernameNormalized: normalizeUsername(username),
      id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
      userId,
    };

    const userProfileData = await prisma.userProfileData.upsert({
      where: {
        userId,
      },
      create: createData,
      update: updateData,
    });

    res.status(StatusCodes.CREATED);
    res.json({ userProfileData });
  };
