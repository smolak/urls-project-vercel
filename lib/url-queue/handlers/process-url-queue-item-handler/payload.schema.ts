import z from "zod";
import { urlQueueIdSchema } from "../../schemas/url-queue-id.schema";

export type ProcessUrlQueueItemHandlerPayloadSchema = z.infer<typeof processUrlQueueItemHandlerPayloadSchema>;

export const processUrlQueueItemHandlerPayloadSchema = z.object({
  urlQueueId: urlQueueIdSchema,
});
