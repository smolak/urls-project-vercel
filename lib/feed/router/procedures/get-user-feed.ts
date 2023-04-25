import { protectedProcedure } from "../../../../server/api/trpc";
import { FeedVM } from "../../models/feed.vm";
import { decompressMetadata } from "../../../metadata/compression";
import { TRPCError } from "@trpc/server";
import { getUserFeed as prismaGetUserFeed } from "../../prisma/get-user-feed";

export const getUserFeed = protectedProcedure.query<ReadonlyArray<FeedVM>>(
  async ({ ctx: { logger, requestId, session } }) => {
    // Needs to be hardcoded and reflect the wrapper (feed) and the name of the procedure (getUserFeeds)
    // Will need to come up with a better solution for this so that this is autogenerated and reflects
    // the path used in logger in isAuthenticated middleware, which detects exactly that path, based on
    // those variable names.
    const path = "feed.getUserFeeds";

    try {
      logger.info({ requestId, path }, "Fetching user's feed list.");

      const userId = session.user.id;
      const feedRawEntries = await prismaGetUserFeed(userId);

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