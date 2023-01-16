import { ProcessUrlQueueItemEvent, processUrlQueueItemHandler } from "../url-queue/handlers/processUrlQueueItemHandler";
import { logger } from "../../logger";
import { RequestId } from "../request-id/utils/generateRequestId";

export enum EventType {
  URL_QUEUE_CREATED = "URL_QUEUE_CREATED",
}

export interface AnEvent<D = Record<string, unknown>> {
  type: EventType;
  data: D & { requestId?: RequestId };
}

type UrlQueueCreatedEvent = (event: ProcessUrlQueueItemEvent) => ReturnType<typeof processUrlQueueItemHandler>;

// List of event types
export type TriggerEvent = UrlQueueCreatedEvent;

// TODO: IDEA#6

export const triggerEvent: TriggerEvent = async (event) => {
  try {
    switch (event.type) {
      case EventType.URL_QUEUE_CREATED:
        logger.info({ requestId: event.data.requestId, event: event.type }, `Event ${event.type} triggered.`);

        return await processUrlQueueItemHandler({
          urlQueueId: event.data.urlQueueId,
          requestId: event.data.requestId,
        });
    }
  } catch (error) {
    logger.error({
      error,
      event,
    });

    throw error;
  }
};
