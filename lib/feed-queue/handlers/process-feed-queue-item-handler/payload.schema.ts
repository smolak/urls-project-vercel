import z from "zod";
import { apiKeySchema } from "../../../api/schemas/api-key.schema";

export type ProcessFeedQueueItemHandlerPayloadSchema = z.infer<typeof processFeedQueueItemHandlerPayloadSchema>;

export const processFeedQueueItemHandlerPayloadSchema = z.object({
  feedQueueApiKey: apiKeySchema,
});
