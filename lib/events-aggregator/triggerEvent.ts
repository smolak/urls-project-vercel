import { processQueueItemHandler, ProcessQueueItemEvent } from "../url-queue/handlers/processQueueItemHandler";
import { logger } from "../../logger";
import { RequestId } from "../shared/utils/generateRequestId";

export enum EventType {
  URL_QUEUE_CREATED,
}

export interface AnEvent<D = Record<string, unknown>> {
  type: EventType;
  data: D & { requestId?: RequestId };
}

type ProcessableEvent = ProcessQueueItemEvent;
export type TriggerEvent = (event: ProcessableEvent) => void;

// TODO: IDEA#6

export const triggerEvent = async (event: ProcessableEvent) => {
  try {
    switch (event.type) {
      case EventType.URL_QUEUE_CREATED:
        logger.info({ requestId: event.data.requestId, event: event.type }, `Event ${event.type} triggered.`);

        return await processQueueItemHandler({
          urlQueueId: event.data.urlQueueId,
          requestId: event.data.requestId,
        });
    }
  } catch (error) {
    logger.error({
      error,
      event,
    });
  }
};
