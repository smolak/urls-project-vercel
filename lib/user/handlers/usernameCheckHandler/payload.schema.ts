import z from "zod";
import { usernameSchema } from "../../schemas/userProfileData.schema";

export type UsernameCheckHandlerPayload = z.infer<typeof usernameCheckHandlerPayloadSchema>;

export const usernameCheckHandlerPayloadSchema = z.object({
  username: usernameSchema,
});
