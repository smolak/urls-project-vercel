import z from "zod";
import { userIdSchema } from "../../../user/schemas/userId.schema";

export type IsFollowingUserPayloadSchema = z.infer<typeof isFollowingUserPayloadSchema>;

export const isFollowingUserPayloadSchema = z.object({
  userId: userIdSchema,
});
