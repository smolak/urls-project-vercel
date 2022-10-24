import { AnEvent, EventType } from "../../../events-aggregator/triggerEvent";
import { Url, UrlQueue } from "@prisma/client";
import { processQueueItemHandlerFactory } from "./factory";
import { getMetadata } from "../../../metadata/getMetadata";
import { ProcessQueueItemHandlerPayload } from "./payload";
import { logger } from "../../../../logger";
import { RequestId } from "../../../shared/utils/generateRequestId";

export interface ProcessQueueItemEvent extends AnEvent<{ urlQueueId: UrlQueue["id"] }> {
  type: EventType.URL_QUEUE_CREATED;
}

export type ProcessQueueItemHandler = ({
  urlQueueId,
  requestId,
}: ProcessQueueItemHandlerPayload & { requestId?: RequestId }) => Promise<Url | undefined>;

export const processQueueItemHandler: ProcessQueueItemHandler = processQueueItemHandlerFactory({ getMetadata, logger });
