import z from "zod";
import { userIdSchema } from "../../../user/schemas/userId.schema";

export const isFollowingUserSchema = z.object({
  userId: userIdSchema,
});
