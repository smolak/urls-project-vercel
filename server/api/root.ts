import { createTRPCRouter } from "./trpc";
import { feedRouter } from "../../lib/feed/router/feed";
import { followUserRouter } from "../../lib/follow-user/router/follow-user";
import { urlRouter } from "../../lib/url/router/url";
import { userProfileDataRouter } from "../../lib/user-profile-data/router/user-profile-data";
import { userRouter } from "../../lib/admin/user/router/user";

export const appRouter = createTRPCRouter({
  feed: feedRouter,
  followUser: followUserRouter,
  url: urlRouter,
  user: userRouter,
  userProfileData: userProfileDataRouter,
});

export type AppRouter = typeof appRouter;
