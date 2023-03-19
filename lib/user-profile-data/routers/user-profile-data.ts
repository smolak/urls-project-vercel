import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../../../server/api/trpc";
import { PrivateUserProfileDataVM, toPrivateUserProfileDataVM } from "../models/PrivateUserProfileData.vm";
import { apiKeySchema, usernameSchema } from "../schemas/userProfileData.schema";
import { normalizeUsername } from "../utils/normalizeUsername";
import { ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR } from "../../../prisma/middlewares/generateModelId";

const getPrivateUserProfileData = protectedProcedure.query<PrivateUserProfileDataVM>(
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

export const usernameCheckInputSchema = z.object({
  username: usernameSchema,
});

const usernameCheck = protectedProcedure
  .input(usernameCheckInputSchema)
  .mutation(async ({ input: { username }, ctx: { logger, requestId, session, prisma } }) => {
    const path = "userProfileData.usernameCheck";

    logger.info({ requestId, path, username }, "Checking username availability.");

    const usernameNormalized = normalizeUsername(username);
    const match = await prisma.userProfileData.findUnique({
      where: {
        usernameNormalized,
      },
    });
    const usernameAvailable = match === null;

    logger.info({ requestId, path, username, usernameAvailable }, "Username availability checked.");

    return { usernameAvailable };
  });

export const createUserProfileDataInputSchema = z.object({
  apiKey: apiKeySchema,
  username: usernameSchema.optional(),
});

export const updateUserProfileDataInputSchema = z.object({
  apiKey: apiKeySchema,
});

const saveUserProfileData = protectedProcedure
  .input(createUserProfileDataInputSchema)
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

    const createUserProfileDataInputSchema = z.object({
      username: usernameSchema,
      apiKey: apiKeySchema,
    });

    const result = createUserProfileDataInputSchema.safeParse(input);

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

export const userProfileDataRouter = createTRPCRouter({
  getPrivateUserProfileData,
  usernameCheck,
  saveUserProfileData,
});
