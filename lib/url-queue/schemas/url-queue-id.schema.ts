import z from "zod";
import { URL_QUEUE_ID_PREFIX } from "../utils/generate-url-queue-id";
import { DEFAULT_ID_SIZE } from "../../shared/utils/generate-id";

export const urlQueueIdSchema = z
  .string()
  .trim()
  .startsWith(URL_QUEUE_ID_PREFIX, { message: "ID passed is not a url queue ID." })
  .length(URL_QUEUE_ID_PREFIX.length + DEFAULT_ID_SIZE, { message: "Wrong ID size." });
