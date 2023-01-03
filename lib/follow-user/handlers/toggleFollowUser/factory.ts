import prisma from "../../../../prisma";
import { GetToken } from "../../../auth/models/GetToken";
import { generateRequestId } from "../../../request-id/utils/generateRequestId";
import { ToggleFollowUserHandler } from "./index";
import { toggleFollowUserPayloadSchema } from "./payload.schema";
import { StatusCodes } from "http-status-codes";
import { Logger } from "pino";

interface Params {
  getToken: GetToken;
  logger: Logger;
}

type ToggleFollowUserHandlerFactory = (params: Params) => ToggleFollowUserHandler;

const actionType = "toggleFollowUserHandler";

export const toggleFollowUserHandlerFactory: ToggleFollowUserHandlerFactory = ({ getToken, logger }) => {
  return async (req, res) => {
    const token = await getToken({ req });
    const requestId = generateRequestId();

    logger.info({ requestId, actionType }, "Toggle following user initiated.");

    // No token?
    if (!token) {
      logger.warn({ requestId, actionType }, "Not logged in.");

      res.status(StatusCodes.FORBIDDEN);
      return;
    }

    const userId = token.sub as string;
    const { body } = req;

    const result = toggleFollowUserPayloadSchema.safeParse(body);

    if (!result.success) {
      logger.error({ requestId, actionType }, "Body validation error.");

      res.status(StatusCodes.NOT_ACCEPTABLE);
      return;
    }

    const followingId = result.data.followingId;

    const maybeFollowing = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followingId,
          followerId: userId,
        },
      },
    });
    const notFollowing = maybeFollowing === null;

    try {
      if (notFollowing) {
        await prisma.$transaction(async (prisma) => {
          await prisma.follows.create({
            data: {
              followingId,
              followerId: userId,
            },
          });

          await prisma.userProfileData.update({
            data: {
              following: {
                increment: 1,
              },
            },
            where: {
              userId,
            },
          });

          await prisma.userProfileData.update({
            data: {
              followers: {
                increment: 1,
              },
            },
            where: {
              userId: followingId,
            },
          });
        });

        logger.info({ requestId, actionType, userId, followingId }, "Followed user.");

        res.status(StatusCodes.CREATED);
        res.json({ following: followingId });
      } else {
        await prisma.$transaction(async (prisma) => {
          await prisma.follows.delete({
            where: {
              followerId_followingId: {
                followingId,
                followerId: userId,
              },
            },
          });

          await prisma.userProfileData.update({
            data: {
              following: {
                decrement: 1,
              },
            },
            where: {
              userId,
            },
          });

          await prisma.userProfileData.update({
            data: {
              followers: {
                decrement: 1,
              },
            },
            where: {
              userId: followingId,
            },
          });
        });

        logger.info({ requestId, actionType, userId, followingId }, "Unfollowed user.");

        res.status(StatusCodes.CREATED);
        res.json({ unfollowed: followingId });
      }
    } catch (error) {
      logger.error({ requestId, actionType, error }, "Failed to (un)follow a user.");

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json({ error: "Failed to (un)follow this user. Try again." });
    }
  };
};
