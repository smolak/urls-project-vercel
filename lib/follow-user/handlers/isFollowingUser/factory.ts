import prisma from "../../../../prisma";
import { GetToken } from "../../../auth/models/GetToken";
import { generateRequestId } from "../../../request-id/utils/generateRequestId";
import { IsFollowingUserHandler } from "./index";
import { StatusCodes } from "http-status-codes";
import { Logger } from "pino";
import { isFollowingUserPayloadSchema } from "./payload.schema";

interface Params {
  getToken: GetToken;
  logger: Logger;
}

type IsFollowingUserHandlerFactory = (params: Params) => IsFollowingUserHandler;

const actionType = "isFollowingUserHandler";

export const isFollowingUserHandlerFactory: IsFollowingUserHandlerFactory = ({ getToken, logger }) => {
  return async (req, res) => {
    const token = await getToken({ req });
    const requestId = generateRequestId();

    logger.info({ requestId, actionType }, "Check if is following a user.");

    // No token?
    if (!token) {
      logger.warn({ requestId, actionType }, "Not logged in.");

      res.status(StatusCodes.FORBIDDEN);
      return;
    }

    const userId = token.sub as string;
    const result = isFollowingUserPayloadSchema.safeParse(req.query);

    if (!result.success) {
      logger.error({ requestId, actionType }, "Query validation error.");

      res.status(StatusCodes.NOT_ACCEPTABLE);
      return;
    }

    const followingId = result.data.userId;

    try {
      const maybeFollowing = await prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followingId,
            followerId: userId,
          },
        },
      });
      const isFollowing = maybeFollowing !== null;

      logger.info({ requestId, actionType, userId, followingId }, "Following a user checked.");

      res.status(StatusCodes.OK);
      res.json({ isFollowing });
    } catch (error) {
      logger.error({ requestId, actionType, error }, "Failed to (un)follow a user.");

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json({ error: "Failed to (un)follow this user. Try again." });
    }
  };
};
