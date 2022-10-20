import { processQueueItemHandler, ProcessQueueItemEvent } from "../url-queue/handlers/processQueueItemHandler";
import { logger } from "../../logger";

export enum EventType {
  URL_QUEUE_CREATED,
}

export interface AnEvent<D = Record<string, unknown>> {
  type: EventType;
  data: D;
}

type ProcessableEvent = ProcessQueueItemEvent;
export type TriggerEvent = (event: ProcessableEvent) => void;

// TODO: IDEA#6

export const triggerEvent = (event: ProcessableEvent) => {
  try {
    switch (event.type) {
      case EventType.URL_QUEUE_CREATED:
        // I am not waiting for it to finish, hence no "await". Fire, forget.
        processQueueItemHandler({ urlQueueId: event.data.urlQueueId });
        return;
    }
  } catch (e) {
    logger.error(e);
  }
};
