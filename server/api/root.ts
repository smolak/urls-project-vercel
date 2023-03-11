import { createTRPCRouter } from "./trpc";
import { helloRouter } from "./routers/hello";
import { feedRouter } from "../../lib/feed/routers/feed";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  hello: helloRouter,
  feed: feedRouter,
});

export type AppRouter = typeof appRouter;
