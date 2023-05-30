import z from "zod";
import { urlQueueIdSchema } from "../../schemas/url-queue-id.schema";

export type ProcessUrlQueueItemHandlerBodySchema = z.infer<typeof processUrlQueueItemHandlerBodySchema>;

export const processUrlQueueItemHandlerBodySchema = z.object({
  urlQueueId: urlQueueIdSchema,
});
