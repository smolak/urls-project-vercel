import z from "zod";
import { usernameSchema } from "../../schemas/userProfileData.schema";

export type UsernameCheckHandlerPayloadSchema = z.infer<typeof usernameCheckHandlerPayloadSchema>;

export const usernameCheckHandlerPayloadSchema = z.object({
  username: usernameSchema,
});
