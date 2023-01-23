import { FeedQueueStatus } from "@prisma/client";
import { Logger } from "pino";
import { StatusCodes } from "http-status-codes";

import { ProcessFeedQueueItemHandler } from "./index";
import { processFeedQueueItemHandlerPayloadSchema } from "./payload.schema";
import { generateRequestId } from "../../../request-id/utils/generateRequestId";
import prisma from "../../../../prisma";
import {
  addFeeds,
  createFollowersCacheKey,
  getFeedQueueEntries,
  getFollowers,
  GetFollowersReturnType,
  getLastAddedFollowId,
  handleNoMoreFollowersCase,
  handleNoMoreTimeCase,
  Result,
} from "./utils";

type Params = {
  logger: Logger;
};

type ProcessFeedQueueItemHandlerFactory = (params: Params) => ProcessFeedQueueItemHandler;

const actionType = "processFeedQueueItemHandler";

// 1_000 items added (createMany) take ~1 second to store (tested locally, can't tell how long on Vercel).
const FEEDS_PER_ITERATION_LIMIT = 500;

// The limit for serverless functions is 10 seconds, but I'd rather limit this to 8
// so that there is time for request to come in, response to come out, and some time
// left for last iteration, should it take more than the average.
const TIME_LIMIT = 8 * 1_000;

const sum = (sum: number, value: number) => sum + value;

export const processFeedQueueItemHandlerFactory: ProcessFeedQueueItemHandlerFactory = ({ logger }) => {
  return async (req, res) => {
    const cache = new Map();

    const START_TIME = Date.now();
    const telemetry = {
      iterationTimes: [] as number[],
      iterationTimesRelativeToFeedLimit: [] as number[],
      feedsAdded: [] as number[],
      iterationTimesTotal: 0,
      averageIterationTime: 0,
      averageIterationTimeRelativeToFeedLimit: 0,
    };

    const requestId = generateRequestId();

    logger.info({ requestId, actionType }, "Processing feed queue item.");

    const result = processFeedQueueItemHandlerPayloadSchema.safeParse(req.body);

    if (!result.success) {
      logger.error({ requestId, actionType }, "Body validation error.");

      res.status(StatusCodes.NOT_ACCEPTABLE);
      res.json({ error: "Body validation error." });
      return;
    }

    const feedQueueApiKey = result.data.feedQueueApiKey;

    if (feedQueueApiKey !== process.env.FEED_QUEUE_API_KEY) {
      logger.error({ requestId, actionType }, "Invalid feed queue API key provided.");

      res.status(StatusCodes.FORBIDDEN);
      res.json({ error: "Body validation error." });
      return;
    }

    try {
      let timeIsAvailable = true;

      // ONGOING ones

      let ongoingFeedsFetchIterationCount = 0;

      do {
        const ongoingFeedQueueItems = await getFeedQueueEntries(
          prisma,
          FeedQueueStatus.ONGOING,
          FEEDS_PER_ITERATION_LIMIT,
          ongoingFeedsFetchIterationCount
        );

        if (ongoingFeedQueueItems.length === 0) {
          break;
        }

        for (let i = 0; i < ongoingFeedQueueItems.length; i++) {
          const {
            id: feedQueueId,
            userId,
            userUrlId,
            lastAddedFollowId: lastAddedFollowIdSource,
          } = ongoingFeedQueueItems[i];

          let followersWithNotAddedFeedArePresent = true;
          let lastAddedFollowId = lastAddedFollowIdSource;

          do {
            const result: Result = await prisma.$transaction(async (prisma) => {
              const cacheKey = createFollowersCacheKey(userId, lastAddedFollowId);
              let followers: GetFollowersReturnType;

              if (cache.has(cacheKey)) {
                followers = cache.get(cacheKey);
              } else {
                followers = await getFollowers(prisma, {
                  followingId: userId,
                  lastAddedFollowId,
                  take: FEEDS_PER_ITERATION_LIMIT,
                });
                cache.set(cacheKey, followers);
              }

              if (followers.length === 0) {
                return await handleNoMoreFollowersCase(prisma, { feedQueueId, lastAddedFollowId });
              }

              const { count } = await addFeeds(prisma, { followers, userUrlId });

              telemetry.feedsAdded.push(count);
              lastAddedFollowId = getLastAddedFollowId(followers);

              if (followers.length < FEEDS_PER_ITERATION_LIMIT) {
                return await handleNoMoreFollowersCase(prisma, { feedQueueId, lastAddedFollowId });
              }

              const ITERATION_TIME_END = Date.now();
              const noMoreTimeForAnotherIteration = ITERATION_TIME_END - START_TIME > TIME_LIMIT;

              if (noMoreTimeForAnotherIteration) {
                return await handleNoMoreTimeCase(prisma, {
                  feedQueueId,
                  feedsPerIterationLimit: FEEDS_PER_ITERATION_LIMIT,
                  numberOfFollowers: followers.length,
                  lastAddedFollowId,
                });
              }

              return Result.CONTINUE;
            });

            if (result === Result.TIME_IS_UP) {
              timeIsAvailable = false;
            }

            if (result === Result.NO_MORE_FOLLOWERS) {
              followersWithNotAddedFeedArePresent = false;
            }
          } while (followersWithNotAddedFeedArePresent && timeIsAvailable);

          if (!timeIsAvailable) {
            break;
          }
        }

        ongoingFeedsFetchIterationCount++;
      } while (timeIsAvailable);

      // NEW ones

      let newFeedsFetchIterationCount = 0;

      do {
        const newFeedQueueItems = await getFeedQueueEntries(
          prisma,
          FeedQueueStatus.NEW,
          FEEDS_PER_ITERATION_LIMIT,
          newFeedsFetchIterationCount
        );

        if (newFeedQueueItems.length === 0) {
          break;
        }

        for (let i = 0; i < newFeedQueueItems.length; i++) {
          const { id: feedQueueId, userId, userUrlId } = newFeedQueueItems[i];

          let followersWithNotAddedFeedArePresent = true;
          let lastAddedFollowId = BigInt(0);

          do {
            const result: Result = await prisma.$transaction(async (prisma) => {
              const cacheKey = createFollowersCacheKey(userId, lastAddedFollowId);
              let followers: GetFollowersReturnType;

              if (cache.has(cacheKey)) {
                followers = cache.get(cacheKey);
              } else {
                followers = await getFollowers(prisma, {
                  followingId: userId,
                  lastAddedFollowId,
                  take: FEEDS_PER_ITERATION_LIMIT,
                });
                cache.set(cacheKey, followers);
              }

              if (followers.length === 0) {
                return await handleNoMoreFollowersCase(prisma, { feedQueueId, lastAddedFollowId });
              }

              const { count } = await addFeeds(prisma, { followers, userUrlId });

              telemetry.feedsAdded.push(count);
              lastAddedFollowId = getLastAddedFollowId(followers);

              if (followers.length < FEEDS_PER_ITERATION_LIMIT) {
                return await handleNoMoreFollowersCase(prisma, { feedQueueId, lastAddedFollowId });
              }

              const ITERATION_TIME_END = Date.now();
              const noMoreTimeForAnotherIteration = ITERATION_TIME_END - START_TIME > TIME_LIMIT;

              if (noMoreTimeForAnotherIteration) {
                return await handleNoMoreTimeCase(prisma, {
                  feedQueueId,
                  feedsPerIterationLimit: FEEDS_PER_ITERATION_LIMIT,
                  numberOfFollowers: followers.length,
                  lastAddedFollowId,
                });
              }

              return Result.CONTINUE;
            });

            if (result === Result.TIME_IS_UP) {
              timeIsAvailable = false;
            }

            if (result === Result.NO_MORE_FOLLOWERS) {
              followersWithNotAddedFeedArePresent = false;
            }
          } while (followersWithNotAddedFeedArePresent && timeIsAvailable);

          if (!timeIsAvailable) {
            break;
          }
        }

        newFeedsFetchIterationCount++;
      } while (timeIsAvailable);

      const feedsAdded = telemetry.feedsAdded.reduce(sum, 0);

      logger.info({ requestId, actionType, feedsAdded }, "Success.");

      res.status(StatusCodes.CREATED);
      res.json({ feedsAdded });
    } catch (error) {
      logger.error({ requestId, actionType, error }, "Failed to process FeedQueue.");

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json({ error: "Failed to process FeedQueue, try again." });
    }
  };
};
