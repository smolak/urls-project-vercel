import { createTRPCRouter, protectedProcedure } from "../../../server/api/trpc";
import z from "zod";
import { Url, UrlQueue } from "@prisma/client";
import { sha1 } from "../../crypto/sha1";
import { ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR } from "../../../prisma/middlewares/generateModelId";
import { EventType, triggerEvent } from "../../events-aggregator/triggerEvent";
import { TRPCError } from "@trpc/server";
import { AdminUrlListVM } from "../../admin/urls/models/AdminUrlList.vm";
import { CompressedMetadata, decompressMetadata } from "../../metadata/compression";

const createUrlInputSchema = z.object({
  url: z
    .string()
    .trim()
    .url()
    .refine(
      (val) => val.startsWith("https://"),
      (val) => ({ message: `Only https:// URLs allowed at the moment. Passed URL: ${val}` })
    )
    .refine(
      (val) => val.length <= 500,
      (val) => ({ message: `Oh NOES! That URL is too long. Detected ${val.length} characters and max 500 is allowed.` })
    ),
});

type ExistingUrlResult = {
  url: Url["url"];
};
type CreatedUrlQueueItemResult = {
  urlQueueId: UrlQueue["id"];
};

type CreateUrlResult = ExistingUrlResult | CreatedUrlQueueItemResult;

const createUrl = protectedProcedure
  .input(createUrlInputSchema)
  .mutation<CreateUrlResult>(async ({ input: { url }, ctx: { logger, requestId, session, prisma } }) => {
    const path = "url.createUrl";
    const userId = session.user.id;
    const urlHash = sha1(url);

    // Check if there's a record for this hash
    const maybeUrl = await prisma.url.findUnique({
      where: {
        urlHash,
      },
    });

    try {
      // If there's one, attempt creating a userUrl entry
      if (maybeUrl) {
        // TODO: Perhaps IDEA#4

        await prisma.$transaction(async (prisma) => {
          const userUrl = await prisma.userUrl.create({
            data: {
              id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
              userId,
              urlId: maybeUrl.id,
            },
          });

          await prisma.feedQueue.create({
            data: {
              id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
              userId,
              userUrlId: userUrl.id,
            },
          });
        });

        logger.info({ requestId, path, url }, "URL exists, added to user.");

        return { url: maybeUrl.url };
      }

      // If there isn't one
      // TODO: IDEA#5
      const urlInQueue = await prisma.urlQueue.create({
        data: {
          id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
          rawUrl: url,
          rawUrlHash: urlHash,
          userId,
        },
      });

      logger.info({ requestId, path, url }, "URL added to queue.");

      await triggerEvent({
        type: EventType.URL_QUEUE_CREATED,
        data: {
          urlQueueId: urlInQueue["id"],
          requestId,
        },
      });

      logger.info({ requestId, path, url }, "Success.");

      return { urlQueueId: urlInQueue.id };
    } catch (error) {
      logger.error({ requestId, path, error }, "Failed to store the URL.");

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to store the URL, try again.",
        cause: error,
      });
    }
  });

type GetUrlsResult = ReadonlyArray<AdminUrlListVM>;

const getUrls = protectedProcedure.query(async ({ ctx: { session, prisma } }) => {
  if (session.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }

  const userUrls = await prisma.userUrl.findMany({
    include: {
      url: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
        },
      },
    },
  });

  const urlList = userUrls.map(({ url, user, ...userUrl }) => {
    return {
      user,
      userUrl,
      url: {
        ...url,
        metadata: decompressMetadata(url.metadata as CompressedMetadata),
      },
    };
  });

  return urlList;
});

export const urlRouter = createTRPCRouter({
  createUrl,
  getUrls,
});

export type UrlRouter = typeof urlRouter;
