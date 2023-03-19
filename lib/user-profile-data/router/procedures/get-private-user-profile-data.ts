import { protectedProcedure } from "../../../../server/api/trpc";
import { PrivateUserProfileDataVM, toPrivateUserProfileDataVM } from "../../models/PrivateUserProfileData.vm";
import { TRPCError } from "@trpc/server";

export const getPrivateUserProfileData = protectedProcedure.query<PrivateUserProfileDataVM>(
  async ({ ctx: { logger, requestId, session, prisma } }) => {
    const path = "userProfileData.getPrivateUserProfileData";
    const userId = session.user.id;

    logger.info({ requestId, path, userId }, "Get private user profile data initiated.");

    const maybeUserProfileData = await prisma.userProfileData.findUnique({
      where: {
        userId,
      },
    });

    if (maybeUserProfileData === null) {
      logger.info({ requestId, path, userId }, "User not found");

      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return toPrivateUserProfileDataVM(maybeUserProfileData);
  }
);
