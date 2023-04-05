import { createTRPCRouter } from "../../../server/api/trpc";
import { getUserFeed } from "./procedures/get-user-feed";

export const feedRouter = createTRPCRouter({
  getUserFeed,
});

export type FeedRouter = typeof feedRouter;
