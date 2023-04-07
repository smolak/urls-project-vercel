import z from "zod";
import { apiKeySchema, usernameSchema } from "../../schemas/user-profile-data.schema";

export const createUserProfileDataSchema = z.object({
  apiKey: apiKeySchema,
  username: usernameSchema,
});
