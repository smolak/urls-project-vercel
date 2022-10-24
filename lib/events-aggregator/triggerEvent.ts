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

export const triggerEvent = (event: ProcessableEvent) => {
  try {
    switch (event.type) {
      case EventType.URL_QUEUE_CREATED:
        logger.info({ requestId: event.data.requestId, event: event.type }, `Event ${event.type} triggered.`);

        // I am not waiting for it to finish, hence no "await". Fire, forget.
        processQueueItemHandler({ urlQueueId: event.data.urlQueueId, requestId: event.data.requestId });
        return;
    }
  } catch (error) {
    logger.error({
      error,
      event,
    });
  }
};
