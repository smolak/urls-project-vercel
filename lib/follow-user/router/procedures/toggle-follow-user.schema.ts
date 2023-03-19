import z from "zod";
import { userIdSchema } from "../../../user/schemas/userId.schema";

export const toggleFollowUserSchema = z.object({
  userId: userIdSchema,
});
