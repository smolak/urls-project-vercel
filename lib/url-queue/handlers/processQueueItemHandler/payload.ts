import z from "zod";

export type ProcessQueueItemHandlerPayload = z.infer<typeof processQueueItemHandlerPayloadSchema>;

export const processQueueItemHandlerPayloadSchema = z.object({
  id: z.string().trim(),
});
