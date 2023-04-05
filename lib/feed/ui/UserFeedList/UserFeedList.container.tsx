import { LoadingUserFeeds } from "../LoadingUserFeeds";
import { ErrorLoadingUserFeeds } from "../ErrorLoadingUserFeeds";
import { UserFeedList } from "./UserFeedList";
import { api } from "../../../../utils/api";

export const UserFeedListContainer = () => {
  const { data, isLoading, isError, error } = api.feed.getUserFeeds.useQuery();

  if (isLoading) {
    return <LoadingUserFeeds />;
  }

  if (isError) {
    return <ErrorLoadingUserFeeds error={error} />;
  }

  return <UserFeedList feed={data} />;
};
