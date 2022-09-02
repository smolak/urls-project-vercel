import { processQueueItemHandler, ProcessQueueItemEvent } from "../url-queue/handlers/processQueueItemHandler";

export enum EventType {
  URL_QUEUE_CREATED,
}

export interface AnEvent<D = Record<string, unknown>> {
  type: EventType;
  data: D;
}

type ProcessableEvent = ProcessQueueItemEvent;

// TODO: IDEA#6

export const triggerEvent = (event: ProcessableEvent) => {
  try {
    switch (event.type) {
      case EventType.URL_QUEUE_CREATED:
        // I am not waiting for it to finish, hence no "await". Fire, forget.
        processQueueItemHandler(event.data.id);
        return;
    }
  } catch (e) {
    console.error(e);
  }
};
