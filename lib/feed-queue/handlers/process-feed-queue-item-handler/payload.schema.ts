import z from "zod";

export type ProcessFeedQueueItemHandlerPayloadSchema = z.infer<typeof processFeedQueueItemHandlerPayloadSchema>;

export const processFeedQueueItemHandlerPayloadSchema = z.object({
  feedQueueApiKey: z.string().min(40).trim(),
});
