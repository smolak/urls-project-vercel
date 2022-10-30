import prisma from "../../../../prisma";
import { compressMetadata } from "../../../metadata/compression";
import { sha1 } from "../../../crypto/sha1";
import { Prisma } from "@prisma/client";
import { ProcessQueueItemHandler } from "./index";
import { Logger } from "pino";
import { ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR } from "../../../../prisma/middlewares/generateModelId";
import { FetchMetadata } from "../../../metadata/fetchMetadata";

interface Params {
  fetchMetadata: FetchMetadata;
  logger: Logger;
}

export type ProcessQueueItemHandlerFactory = (params: Params) => ProcessQueueItemHandler;

export const processQueueItemHandlerFactory: ProcessQueueItemHandlerFactory =
  ({ fetchMetadata, logger }) =>
  async ({ urlQueueId, requestId }) => {
    logger.info({ requestId, urlQueueId }, "Processing URL queue item.");
    try {
      const item = await prisma.urlQueue.findFirstOrThrow({
        where: {
          id: urlQueueId,
          status: {
            in: ["NEW", "FAILED"],
          },
        },
      });

      await prisma.urlQueue.update({
        data: {
          attemptCount: item.attemptCount + 1,
        },
        where: {
          id: urlQueueId,
        },
      });

      const metadata = await fetchMetadata(item.rawUrl);

      logger.info({ requestId, metadata }, "Metadata fetched.");

      const url = metadata.url || item.rawUrl;
      const urlHash = sha1(url);
      const compressedMetadata = compressMetadata(metadata);

      const createdUrl = await prisma.$transaction(async (prisma) => {
        const createdUrl = await prisma.url.create({
          data: {
            id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
            url,
            urlHash,
            title: metadata.title || "",
            description: metadata.description || "",
            metadata: compressedMetadata as Prisma.JsonObject,
          },
        });

        await prisma.userUrl.create({
          data: {
            id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
            userId: item.userId,
            urlId: createdUrl.id,
          },
        });

        await prisma.urlQueue.update({
          data: {
            metadata: compressedMetadata as Prisma.JsonObject,
            status: "ACCEPTED",
          },
          where: {
            id: urlQueueId,
          },
        });

        logger.info({ requestId, createdUrl }, "Processing finished, URL created.");

        return createdUrl;
      });

      return createdUrl;
    } catch (error) {
      logger.error({ requestId, error }, "Failed to process URL queue item.");
    }
  };
