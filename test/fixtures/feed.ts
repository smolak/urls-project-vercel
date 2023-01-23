import { Feed } from "@prisma/client";
import { generateFeedId } from "../../lib/feed/utils/generateFeedId";
import { generateUserId } from "../../lib/user/utils/generateUserId";
import { generateUserUrlId } from "../../lib/user-url/utils/generateUserUrlId";

export const createFeed = (overwrites: Partial<Feed> = {}): Feed => ({
  id: generateFeedId(),
  userId: generateUserId(),
  userUrlId: generateUserUrlId(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overwrites,
});
