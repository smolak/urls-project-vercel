import { Logger } from "pino";
import { StatusCodes } from "http-status-codes";
import getConfig from "next/config";

import { ProcessUrlQueueItemHandler } from "./index";
import { FetchMetadata } from "../../../metadata/fetch-metadata";
import { generateRequestId } from "../../../request-id/utils/generate-request-id";
import { authorizationHeaderSchema } from "../../../auth/schemas/authorization-header.schema";
import { actionType, processUrlQueueItem } from "./process-url-queue-item";
import { getAuthToken } from "../../../auth/api/utils/get-auth-token";

interface Params {
  fetchMetadata: FetchMetadata;
  logger: Logger;
}

export type ProcessUrlQueueItemHandlerFactory = (params: Params) => ProcessUrlQueueItemHandler;

export const processUrlQueueItemHandlerFactory: ProcessUrlQueueItemHandlerFactory = ({ fetchMetadata, logger }) => {
  return async (req, res) => {
    const requestId = generateRequestId();

    logger.info({ requestId, actionType }, "Processing URL queue item.");

    const authHeaderResult = authorizationHeaderSchema.safeParse(req.headers.authorization);

    if (!authHeaderResult.success) {
      logger.error({ requestId, actionType }, "Authorization header validation error.");

      res.status(StatusCodes.UNAUTHORIZED);
      res.json({ error: "Authorization error." });
      return;
    }

    const urlQueueApiKey = getAuthToken(authHeaderResult.data);

    if (urlQueueApiKey !== getConfig().serverRuntimeConfig.urlQueueApiKey) {
      logger.error({ requestId, actionType }, "Invalid url queue API key provided.");

      res.status(StatusCodes.FORBIDDEN);
      res.json({ error: "Authorization error." });
      return;
    }

    try {
      const urlEntryCreated = await processUrlQueueItem({ fetchMetadata, logger, requestId });

      if (urlEntryCreated === null) {
        logger.info({ requestId, actionType }, "Queue is empty.");

        res.status(StatusCodes.NO_CONTENT);
        res.end();
        return;
      }

      res.status(StatusCodes.CREATED);
      res.json({ url: urlEntryCreated });
    } catch (error) {
      logger.error({ requestId, actionType, error }, "Failed to process URL queue item.");

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json({ error: "Failed to process URL queue item." });
    }
  };
};
