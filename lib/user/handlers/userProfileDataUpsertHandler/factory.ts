import { GetToken } from "../../../auth/models/GetToken";
import { Logger } from "pino";
import { UserProfileDataUpsertHandler } from "./index";
import { generateRequestId } from "../../../shared/utils/generateRequestId";
import { StatusCodes } from "http-status-codes";
import { createUserProfileDataPayloadSchema, updateUserProfileDataPayloadSchema } from "./payload.schema";
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

    const userId = token.sub as string;

    const maybeUserProfileData = await prisma.userProfileData.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
        username: true,
      },
    });

    // Can't rely on role: without logging out and in again, when new user is created
    // role is NEW_USER and such a user can stay on update user profile data form page
    // and save again and again, and at that point user profile data for that user
    // already exists.

    // Existing user profile data indicates that username is supposed to be already set.
    // That means that if req body payload contains username, it should reject such request.
    if (maybeUserProfileData?.username) {
      // Everything else needs to be parsed, still.
      const result = updateUserProfileDataPayloadSchema.safeParse(req.body);

      if (!result.success) {
        logger.error({ requestId, actionType }, "Body validation error.");

        res.status(StatusCodes.NOT_ACCEPTABLE);
        return;
      }

      const userProfileData = await prisma.userProfileData.update({
        where: {
          userId,
        },
        // Add a test that data does not contain username even if it is sent in payload.
        // This is very important.
        data: result.data,
      });

      res.status(StatusCodes.CREATED);
      res.json({ userProfileData });

      return;
    }

    // When user payload data does not exist, it should be created.
    const result = createUserProfileDataPayloadSchema.safeParse(req.body);

    if (!result.success) {
      logger.error({ requestId, actionType }, "Body validation error.");

      res.status(StatusCodes.NOT_ACCEPTABLE);
      return;
    }

    const { apiKey, username } = result.data;

    const userProfileData = await prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: "USER",
        },
      });

      return await prisma.userProfileData.create({
        data: {
          apiKey,
          username,
          usernameNormalized: normalizeUsername(username),
          id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
          userId,
        },
      });
    });

    res.status(StatusCodes.CREATED);
    res.json({ userProfileData });
  };
