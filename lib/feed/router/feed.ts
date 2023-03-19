import { createTRPCRouter } from "../../../server/api/trpc";
import { getUserFeeds } from "./procedures/get-user-feeds";

export const feedRouter = createTRPCRouter({
  getUserFeeds,
});

export type FeedRouter = typeof feedRouter;
