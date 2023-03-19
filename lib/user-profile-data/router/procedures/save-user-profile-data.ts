import { protectedProcedure } from "../../../../server/api/trpc";
import { TRPCError } from "@trpc/server";
import { normalizeUsername } from "../../utils/normalizeUsername";
import { ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR } from "../../../../prisma/middlewares/generateModelId";
import { createUserProfileDataSchema } from "./create-user-profile-data.schema";

export const saveUserProfileData = protectedProcedure
  .input(createUserProfileDataSchema)
  .mutation(async ({ input, ctx: { logger, requestId, session, prisma } }) => {
    const userId = session.user.id;
    const path = "userProfileData.saveUserProfileData";

    logger.info({ requestId, path }, "Upsert user profile initiated.");

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
    // That means that if input payload contains username, it should reject such request.
    const accountIsFreshlyCreated = maybeUserProfileData?.username;

    if (accountIsFreshlyCreated) {
      const { username, ...updateData } = input;
      const userProfileData = await prisma.userProfileData.update({
        where: {
          userId,
        },
        // Add a test that data does not contain username even if it is sent in payload.
        // This is very important.
        data: updateData,
      });

      logger.info({ requestId, path }, "User profile data update complete.");

      return userProfileData;
    }

    // UPDATE EXISTING ACCOUNT THAT HAS USERNAME SET ALREADY
    const result = createUserProfileDataSchema.safeParse(input);

    if (!result.success) {
      logger.error({ requestId, path, error: result.error }, "Input data parsing error.");

      throw new TRPCError({ code: "BAD_REQUEST", message: result.error.message, cause: result.error });
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

    logger.info({ requestId, path }, "User profile data creation complete.");

    return userProfileData;
  });
