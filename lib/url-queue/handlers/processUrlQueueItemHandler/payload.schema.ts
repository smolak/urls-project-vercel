import z from "zod";
import { urlQueueIdSchema } from "../../schemas/urlQueueId.schema";

export type ProcessUrlQueueItemHandlerPayloadSchema = z.infer<typeof processUrlQueueItemHandlerPayloadSchema>;

export const processUrlQueueItemHandlerPayloadSchema = z.object({
  urlQueueId: urlQueueIdSchema,
});
