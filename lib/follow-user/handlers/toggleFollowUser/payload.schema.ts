import z from "zod";
import { userIdSchema } from "../../../user/schemas/userId.schema";

export type ToggleFollowUserPayloadSchema = z.infer<typeof toggleFollowUserPayloadSchema>;

export const toggleFollowUserPayloadSchema = z.object({
  userId: userIdSchema,
});
