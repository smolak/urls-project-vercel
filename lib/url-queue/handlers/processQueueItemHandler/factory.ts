import prisma from "../../../../prisma";
import { GetMetadata, Metadata } from "../../../metadata/getMetadata";
import { compressMetadata } from "../../../metadata/compression";
import { sha1 } from "../../../crypto/sha1";
import { Prisma, UrlQueue } from "@prisma/client";
import { ProcessQueueItemHandler } from "./index";
import axios from "axios";
import { Logger } from "pino";
import { ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR } from "../../../../prisma/middlewares/generateModelId";

interface HeadResponse {
  headers: {
    "content-type": string;
  };
}

interface Params {
  getMetadata: GetMetadata;
  logger: Logger;
}

const fetchMetadata = async (getMetadata: GetMetadata, url: UrlQueue["rawUrl"]): Promise<Metadata> => {
  const result = await axios.head<any, HeadResponse>(url);

  const contentType = result.headers["content-type"];
  const isAWebsite = contentType.includes("text/html");

  let metadata: Metadata = {};

  if (isAWebsite) {
    metadata = await getMetadata(url);
  }

  metadata.contentType = contentType;

  return metadata;
};

export type ProcessQueueItemHandlerFactory = ({ getMetadata }: Params) => ProcessQueueItemHandler;

export const processQueueItemHandlerFactory: ProcessQueueItemHandlerFactory =
  ({ getMetadata, logger }) =>
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

      const metadata = await fetchMetadata(getMetadata, item.rawUrl);
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
