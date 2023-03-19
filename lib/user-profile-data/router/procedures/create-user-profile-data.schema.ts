import z from "zod";
import { apiKeySchema, usernameSchema } from "../../schemas/userProfileData.schema";

export const createUserProfileDataSchema = z.object({
  apiKey: apiKeySchema,
  username: usernameSchema,
});
