import { FeedQueue, FeedQueueStatus } from "@prisma/client";
import { generateFeedQueueId } from "../../lib/feed-queue/utils/generate-feed-queue-id";
import { generateUserId } from "../../lib/user/utils/generate-user-id";
import { generateUserUrlId } from "../../lib/user-url/utils/generate-user-url-id";

export const createFeedQueue = (overwrites: Partial<FeedQueue> = {}): FeedQueue => {
  return {
    id: generateFeedQueueId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    status: FeedQueueStatus.NEW,
    attemptCount: 0,
    lastAddedFollowId: BigInt(0),
    userId: generateUserId(),
    userUrlId: generateUserUrlId(),
    ...overwrites,
  };
};
