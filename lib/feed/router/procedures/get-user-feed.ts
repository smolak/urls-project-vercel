import { publicProcedure } from "../../../../server/api/trpc";
import { FeedVM, toFeedVM } from "../../models/feed.vm";
import { TRPCError } from "@trpc/server";
import { getUserFeed as prismaGetUserFeed } from "../../prisma/get-user-feed";
import z from "zod";
import getConfig from "next/config";
import { userIdSchema } from "../../../user/schemas/user-id.schema";

type QuerySchema = z.infer<typeof querySchema>;

const itemsPerFetch = getConfig().serverRuntimeConfig.userFeedList.itemsPerPage;
const querySchema = z.object({
  cursor: z.date().optional(),
  userId: userIdSchema,
});

export type GetUserFeedResponse = {
  feed: ReadonlyArray<FeedVM>;
  nextCursor?: QuerySchema["cursor"];
};

export const getUserFeed = publicProcedure
  .input(querySchema)
  .query<GetUserFeedResponse>(async ({ ctx: { logger, requestId }, input }) => {
    // Needs to be hardcoded and reflect the wrapper (feed) and the name of the procedure (getUserFeeds)
    // Will need to come up with a better solution for this so that this is autogenerated and reflects
    // the path used in logger in isAuthenticated middleware, which detects exactly that path, based on
    // those variable names.
    const path = "feed.getUserFeed";

    try {
      logger.info({ requestId, path }, "Fetching user's feed list.");

      const feedRawEntries = await prismaGetUserFeed(input.userId, itemsPerFetch, input.cursor);
      const feed = feedRawEntries.map(toFeedVM);

      logger.info({ requestId, path, userId: input.userId }, "User's feed list fetched.");

      let nextCursor: QuerySchema["cursor"] = undefined;

      if (feedRawEntries.length === itemsPerFetch) {
        nextCursor = feedRawEntries[feedRawEntries.length - 1].feed_createdAt;
      }

      return {
        feed,
        nextCursor,
      };
    } catch (error) {
      logger.error({ requestId, path, error }, "Failed to fetch user's feed list.");

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user's feed list.",
        cause: error,
      });
    }
  });
