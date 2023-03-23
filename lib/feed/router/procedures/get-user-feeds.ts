import { protectedProcedure } from "../../../../server/api/trpc";
import { FeedVM } from "../../models/Feed.vm";
import getConfig from "next/config";
import { CompressedMetadata, decompressMetadata } from "../../../metadata/compression";
import { TRPCError } from "@trpc/server";
import { Feed, Url, User, UserProfileData, UserUrl } from "@prisma/client";

type RawFeedEntry = {
  feed_id: Feed["id"];
  feed_createdAt: Feed["createdAt"];
  user_name: User["name"];
  user_username: UserProfileData["username"];
  user_image: User["image"];
  url_url: Url["url"];
  url_metadata: CompressedMetadata;
  userUrl_id: UserUrl["id"];
};

export const getUserFeeds = protectedProcedure.query<ReadonlyArray<FeedVM>>(
  async ({ ctx: { logger, requestId, session, prisma } }) => {
    // Needs to be hardcoded and reflect the wrapper (feed) and the name of the procedure (getUserFeeds)
    // Will need to come up with a better solution for this so that this is autogenerated and reflects
    // the path used in logger in isAuthenticated middleware, which detects exactly that path, based on
    // those variable names.
    const path = "feed.getUserFeeds";

    try {
      logger.info({ requestId, path }, "Fetching user's feed list.");

      const userId = session.user.id;
      const itemsPerFetch = getConfig().serverRuntimeConfig.userFeedList.itemsPerFetch;

      const feedRawEntries = await prisma.$queryRaw<ReadonlyArray<RawFeedEntry>>`
          SELECT User.name AS user_name, User.image AS user_image, UserProfileData.username AS user_username,
                 Feed.id AS feed_id, Feed.createdAt AS feed_createdAt, Url.url AS url_url, Url.metadata AS url_metadata,
                 UserUrl.id AS userUrl_id
          FROM Feed
          LEFT JOIN UserUrl ON Feed.userUrlId = UserUrl.id
          LEFT JOIN Url ON UserUrl.urlId = Url.id
          LEFT JOIN User ON UserUrl.userId = User.id
          LEFT JOIN UserProfileData ON User.id = UserProfileData.userId
          WHERE Feed.userId = ${userId}
          ORDER BY Feed.createdAt
          DESC LIMIT 0, ${itemsPerFetch}
      `;

      const feeds = feedRawEntries.map((entry) => {
        return {
          id: entry.feed_id,
          createdAt: entry.feed_createdAt,
          user: {
            name: entry.user_name,
            image: entry.user_image,
            username: entry.user_username,
          },
          url: {
            url: entry.url_url,
            metadata: decompressMetadata(entry.url_metadata),
          },
          userUrlId: entry.userUrl_id,
        };
      });

      logger.info({ requestId, path, userId }, "User's feed list fetched.");

      return feeds;
    } catch (error) {
      logger.error({ requestId, path, error }, "Failed to fetch user's feed list.");

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user's feed list.",
        cause: error,
      });
    }
  }
);