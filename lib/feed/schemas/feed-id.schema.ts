import z from "zod";

import { DEFAULT_ID_SIZE } from "../../shared/utils/generate-id";
import { FEED_ID_PREFIX } from "../utils/generate-feed-id";

export const feedIdSchema = z
  .string()
  .trim()
  .startsWith(FEED_ID_PREFIX, { message: "ID passed is not a feed ID." })
  .length(FEED_ID_PREFIX.length + DEFAULT_ID_SIZE, { message: "Wrong ID size." });
