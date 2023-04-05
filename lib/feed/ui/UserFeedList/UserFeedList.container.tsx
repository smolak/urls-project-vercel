import { LoadingUserFeed } from "../LoadingUserFeed";
import { ErrorLoadingUserFeed } from "../ErrorLoadingUserFeed";
import { UserFeedList } from "./UserFeedList";
import { api } from "../../../../utils/api";

export const UserFeedListContainer = () => {
  const { data, isLoading, isError, error } = api.feed.getUserFeed.useQuery();

  if (isLoading) {
    return <LoadingUserFeed />;
  }

  if (isError) {
    return <ErrorLoadingUserFeed error={error} />;
  }

  return <UserFeedList feed={data} />;
};
