import z from "zod";
import { apiKeySchema } from "../../../api/schemas/api-key.schema";

export const processUrlQueueItemHandlerQuerySchema = z.object({
  urlQueueApiKey: apiKeySchema,
});
