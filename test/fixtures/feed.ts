import { Feed } from "@prisma/client";
import { generateFeedId } from "../../lib/feed/utils/generate-feed-id";
import { generateUserId } from "../../lib/user/utils/generate-user-id";
import { generateUserUrlId } from "../../lib/user-url/utils/generate-user-url-id";

export const createFeed = (overwrites: Partial<Feed> = {}): Feed => ({
  id: generateFeedId(),
  userId: generateUserId(),
  userUrlId: generateUserUrlId(),
  createdAt: new Date(),
  updatedAt: new Date(),
  liked: false,
  ...overwrites,
});
