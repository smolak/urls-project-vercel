import prisma from "../../../../prisma";
import { sha1 } from "../../../crypto/sha1";
import { compressMetadata } from "../../../metadata/compression";
import { Prisma, Url, UrlQueue } from "@prisma/client";
import { ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR } from "../../../../prisma/middlewares/generate-model-id";
import { FetchMetadata } from "../../../metadata/fetch-metadata";
import { Logger } from "pino";

interface Params {
  fetchMetadata: FetchMetadata;
  logger: Logger;
  urlQueueId: UrlQueue["id"];
  requestId: string;
}

type ProcessUrlQueueItem = (params: Params) => Promise<Url>;

export const actionType = "processUrlQueueItemHandler";

export const processUrlQueueItem: ProcessUrlQueueItem = async ({ urlQueueId, fetchMetadata, logger, requestId }) => {
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

  logger.info({ requestId, actionType, metadata }, "Metadata fetched.");

  const url = metadata.url || item.rawUrl;
  const urlHash = sha1(url);
  const compressedMetadata = compressMetadata(metadata);

  let urlEntry: Url | null = null;

  if (metadata.url !== item.rawUrl) {
    urlEntry = await prisma.url.findUnique({
      where: { urlHash },
    });
  }

  const urlEntryCreated = await prisma.$transaction(async (prisma) => {
    if (!urlEntry) {
      urlEntry = await prisma.url.create({
        data: {
          id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
          url,
          urlHash,
          metadata: compressedMetadata as Prisma.JsonObject,
        },
      });
    }

    const userUrl = await prisma.userUrl.create({
      data: {
        id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
        userId: item.userId,
        urlId: urlEntry.id,
      },
    });

    await prisma.feedQueue.create({
      data: {
        id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
        userId: item.userId,
        userUrlId: userUrl.id,
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

    logger.info({ requestId, actionType, createdUrl: urlEntry }, "Processing finished, URL created.");

    return urlEntry;
  });

  return urlEntryCreated;
};
