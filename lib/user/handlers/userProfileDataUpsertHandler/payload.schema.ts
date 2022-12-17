import z from "zod";
import { apiKeySchema, usernameSchema } from "../../schemas/userProfileData.schema";

export const createUserProfileDataPayloadSchema = z.object({
  username: usernameSchema,
  apiKey: apiKeySchema,
});

export const updateUserProfileDataPayloadSchema = z.object({
  apiKey: apiKeySchema,
});
