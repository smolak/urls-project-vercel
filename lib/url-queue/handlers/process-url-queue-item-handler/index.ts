import { AnEvent, EventType } from "../../../events-aggregator/trigger-event";
import { Url, UrlQueue } from "@prisma/client";
import { processUrlQueueItemHandlerFactory } from "./factory";
import { fetchMetadata } from "../../../metadata/fetch-metadata";
import { logger } from "../../../../logger";
import { NextApiRequest, NextApiResponse } from "next";

export interface ProcessUrlQueueItemEvent extends AnEvent<{ urlQueueId: UrlQueue["id"] }> {
  type: EventType.URL_QUEUE_CREATED;
}

export type ProcessUrlQueueItemSuccessResponse = {
  url: Url;
};
export type ProcessUrlQueueItemFailureResponse = { error: string };
export type ProcessUrlQueueItemResponse = ProcessUrlQueueItemSuccessResponse | ProcessUrlQueueItemFailureResponse;

export type ProcessUrlQueueItemHandler = (
  req: NextApiRequest,
  res: NextApiResponse<ProcessUrlQueueItemResponse>
) => Promise<void>;

export const processUrlQueueItemHandler: ProcessUrlQueueItemHandler = processUrlQueueItemHandlerFactory({
  fetchMetadata,
  logger,
});
