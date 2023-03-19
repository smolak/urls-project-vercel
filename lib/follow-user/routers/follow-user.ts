import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../../../server/api/trpc";
import { userIdSchema } from "../../user/schemas/userId.schema";
import { TRPCError } from "@trpc/server";
import { User } from "@prisma/client";

const isFollowingUserInputSchema = z.object({
  userId: userIdSchema,
});

const isFollowingUser = protectedProcedure
  .input(isFollowingUserInputSchema)
  .query(async ({ input: { userId: followingId }, ctx: { logger, requestId, session, prisma } }) => {
    const path = "followUser.isFollowingUser";
    const followerId = session.user.id;

    logger.info({ requestId, path, followerId, followingId }, "Check if is following a user.");

    try {
      const maybeFollowing = await prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followingId,
            followerId,
          },
        },
      });
      const isFollowing = maybeFollowing !== null;

      logger.info({ requestId, path, followerId, followingId }, "Following a user checked.");

      return isFollowing;
    } catch (error) {
      logger.error({ requestId, path, followerId, followingId, error }, "Failed to check follow status.");

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to check follow status. Try again.",
        cause: error,
      });
    }
  });

const toggleFollowUserInputSchema = z.object({
  userId: userIdSchema,
});

type ToggleFollowUserResult = {
  status: "following" | "unfollowed";
  userId: User["id"];
};

const toggleFollowUser = protectedProcedure
  .input(toggleFollowUserInputSchema)
  .mutation<ToggleFollowUserResult>(
    async ({ input: { userId: followingId }, ctx: { logger, requestId, session, prisma } }) => {
      const path = "followUser.toggleFollowUser";
      const followerId = session.user.id;

      logger.info({ requestId, path, followerId, followingId }, "Toggle following user initiated.");

      try {
        const maybeFollowing = await prisma.follows.findUnique({
          where: {
            followerId_followingId: {
              followingId,
              followerId,
            },
          },
        });
        const notFollowing = maybeFollowing === null;

        if (notFollowing) {
          await prisma.$transaction(async (prisma) => {
            await prisma.follows.create({
              data: {
                followingId,
                followerId,
              },
            });

            await prisma.userProfileData.update({
              data: {
                following: {
                  increment: 1,
                },
              },
              where: {
                userId: followerId,
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

          logger.info({ requestId, path, followerId, followingId }, "Followed user.");

          return { status: "following", userId: followingId };
        } else {
          await prisma.$transaction(async (prisma) => {
            await prisma.follows.delete({
              where: {
                followerId_followingId: {
                  followingId,
                  followerId,
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
                userId: followerId,
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

          logger.info({ requestId, path, followerId, followingId }, "Unfollowed user.");

          return { status: "unfollowed", userId: followingId };
        }
      } catch (error) {
        logger.error({ requestId, path, followerId, followingId, error }, "Failed to (un)follow a user.");

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to (un)follow this user. Try again.",
          cause: error,
        });
      }
    }
  );

export const followUserRouter = createTRPCRouter({
  isFollowingUser,
  toggleFollowUser,
});

export type FollowUserRouter = typeof followUserRouter;
