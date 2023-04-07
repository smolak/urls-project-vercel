import z from "zod";
import { USER_ID_PREFIX } from "../utils/generate-user-id";
import { DEFAULT_ID_SIZE } from "../../shared/utils/generate-id";

export const userIdSchema = z
  .string()
  .trim()
  .startsWith(USER_ID_PREFIX, { message: "ID passed is not a user ID." })
  .length(USER_ID_PREFIX.length + DEFAULT_ID_SIZE, { message: "Wrong ID size." });
