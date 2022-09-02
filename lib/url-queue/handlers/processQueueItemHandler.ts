import prisma from "../../../prisma";
import { getMetadata, Metadata } from "../../metadata/getMetadata";
import { compressMetadata } from "../../metadata/compression";
import { sha1 } from "../../crypto/sha1";
import { AnEvent, EventType } from "../../events-aggregator/triggerEvent";
import { Prisma, UrlQueue } from "@prisma/client";
import axios from "axios";

export interface ProcessQueueItemEvent extends AnEvent<{ id: UrlQueue["id"] }> {
  type: EventType.URL_QUEUE_CREATED;
}

interface HeadResponse {
  "content-type": string;
}

const fetchMetadata = async (url: UrlQueue["rawUrl"]): Promise<Metadata> => {
  const result = await axios.head<any, HeadResponse>(url);
  const isAWebsite = result["content-type"].includes("text/html");

  let metadata: Metadata = {};

  if (isAWebsite) {
    metadata = await getMetadata(url);
  }

  metadata.contentType = result["content-type"];

  return metadata;
};

export const processQueueItemHandler = async (id: UrlQueue["id"]) => {
  try {
    const item = await prisma.urlQueue.findFirstOrThrow({
      where: {
        id,
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
        id,
      },
    });

    const metadata = await fetchMetadata(item.rawUrl);
    const url = metadata.url || item.rawUrl;
    const urlHash = sha1(url);
    const compressedMetadata = compressMetadata(metadata);

    const createdUrl = await prisma.$transaction(async (prisma) => {
      const createdUrl = await prisma.url.create({
        data: {
          id: "will-be-created-by-middleware",
          url,
          urlHash,
          title: metadata.title || "",
          description: metadata.description || "",
          metadata: compressedMetadata as Prisma.JsonObject,
        },
      });

      await prisma.userUrl.create({
        data: {
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
          id,
        },
      });

      return createdUrl;
    });

    return createdUrl;
  } catch (e) {
    console.error(e);
  }
};
