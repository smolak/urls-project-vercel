import z from "zod";
import { usernameSchema } from "../../schemas/userProfileData.schema";

export type UserProfileDataUpsertHandler = z.infer<typeof userProfileDataUpsertPayloadSchema>;

export const userProfileDataUpsertPayloadSchema = z.object({
  username: usernameSchema,
});
