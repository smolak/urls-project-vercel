import z from "zod";
import { usernameSchema } from "../../schemas/userProfileData.schema";

export const usernameCheckSchema = z.object({
  username: usernameSchema,
});
