import { createTRPCRouter } from "./trpc";
import { feedRouter } from "../../lib/feed/routers/feed";
import { followUserRouter } from "../../lib/follow-user/routers/follow-user";
import { helloRouter } from "./routers/hello";
import { urlRouter } from "../../lib/url/routers/url";
import { userProfileDataRouter } from "../../lib/user-profile-data/routers/user-profile-data";
import { userRouter } from "../../lib/admin/user/routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  feed: feedRouter,
  followUser: followUserRouter,
  hello: helloRouter,
  url: urlRouter,
  user: userRouter,
  userProfileData: userProfileDataRouter,
});

export type AppRouter = typeof appRouter;
