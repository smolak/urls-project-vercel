import { useGetUserFeeds } from "../../hooks/useGetUserFeeds";
import { LoadingUserFeeds } from "../LoadingUserFeeds";
import { ErrorLoadingUserFeeds } from "../ErrorLoadingUserFeeds";
import { UserFeedList } from "./UserFeedList";

export const UserFeedListContainer = () => {
  const { data, isLoading, isError, error } = useGetUserFeeds();

  if (isLoading) {
    return <LoadingUserFeeds />;
  }

  if (isError) {
    return <ErrorLoadingUserFeeds error={error} />;
  }

  return <UserFeedList feeds={data.feeds} />;
};
