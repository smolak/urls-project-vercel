import { FeedQueue, FeedQueueStatus } from "@prisma/client";
import { generateFeedQueueId } from "../../lib/feed-queue/utils/generateFeedQueueId";
import { generateUserId } from "../../lib/user/utils/generateUserId";
import { generateUserUrlId } from "../../lib/user-url/utils/generateUserUrlId";

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
