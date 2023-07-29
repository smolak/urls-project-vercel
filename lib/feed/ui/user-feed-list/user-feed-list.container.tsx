import { LoadingUserFeed } from "../loading-user-feed";
import { ErrorLoadingUserFeed } from "../error-loading-user-feed";
import { UserFeedList } from "./user-feed-list";
import { api } from "../../../../utils/api";

export const UserFeedListContainer = () => {
  const { data, isLoading, isError } = api.feed.getUserFeed.useQuery();

  if (isLoading) {
    return <LoadingUserFeed />;
  }

  if (isError) {
    return <ErrorLoadingUserFeed />;
  }

  return <UserFeedList feed={data} />;
};
