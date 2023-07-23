import { createTRPCRouter } from "../../../server/api/trpc";
import { getUserFeed } from "./procedures/get-user-feed";
import { toggleLikeUrl } from "./procedures/toggle-like-url";

export const feedRouter = createTRPCRouter({
  getUserFeed,
  toggleLikeUrl,
});

export type FeedRouter = typeof feedRouter;
