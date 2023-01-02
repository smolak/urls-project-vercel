import z from "zod";
import { USER_ID_PREFIX } from "../utils/generateUserId";
import { DEFAULT_ID_SIZE } from "../../shared/utils/generateId";

export const userIdSchema = z
  .string()
  .startsWith(USER_ID_PREFIX, { message: "ID passed is not a user ID." })
  .length(USER_ID_PREFIX.length + DEFAULT_ID_SIZE, { message: "Wrong ID size." })
  .trim();
