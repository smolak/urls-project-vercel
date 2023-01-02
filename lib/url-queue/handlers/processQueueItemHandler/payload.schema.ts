import z from "zod";
import { urlQueueIdSchema } from "../../schemas/urlQueueId.schema";

export type ProcessQueueItemHandlerPayloadSchema = z.infer<typeof processQueueItemHandlerPayloadSchema>;

export const processQueueItemHandlerPayloadSchema = z.object({
  urlQueueId: urlQueueIdSchema,
});
