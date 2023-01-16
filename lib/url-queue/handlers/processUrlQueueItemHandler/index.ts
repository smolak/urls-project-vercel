import { AnEvent, EventType } from "../../../events-aggregator/triggerEvent";
import { Url, UrlQueue } from "@prisma/client";
import { processUrlQueueItemHandlerFactory } from "./factory";
import { fetchMetadata } from "../../../metadata/fetchMetadata";
import { ProcessUrlQueueItemHandlerPayloadSchema } from "./payload.schema";
import { logger } from "../../../../logger";
import { RequestId } from "../../../request-id/utils/generateRequestId";

export interface ProcessUrlQueueItemEvent extends AnEvent<{ urlQueueId: UrlQueue["id"] }> {
  type: EventType.URL_QUEUE_CREATED;
}

export type ProcessUrlQueueItemHandler = ({
  urlQueueId,
  requestId,
}: ProcessUrlQueueItemHandlerPayloadSchema & { requestId?: RequestId }) => Promise<Url | undefined>;

export const processUrlQueueItemHandler: ProcessUrlQueueItemHandler = processUrlQueueItemHandlerFactory({
  fetchMetadata,
  logger,
});
