import z from "zod";
import { apiKeySchema } from "../../schemas/user-profile-data.schema";

export const updateUserProfileDataSchema = z.object({
  apiKey: apiKeySchema,
});
