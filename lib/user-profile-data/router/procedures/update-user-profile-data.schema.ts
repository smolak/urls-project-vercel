import z from "zod";
import { apiKeySchema } from "../../schemas/userProfileData.schema";

export const updateUserProfileDataSchema = z.object({
  apiKey: apiKeySchema,
});
