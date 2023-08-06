import { LoadingUserFeed } from "../loading-user-feed";
import { ErrorLoadingUserFeed } from "../error-loading-user-feed";
import { api } from "../../../../utils/api";
import { InfiniteData } from "@tanstack/react-query";
import { GetUserFeedResponse } from "../../router/procedures/get-user-feed";
import { FeedVM } from "../../models/feed.vm";
import { InfiniteUserFeedList } from "./infinite-user-feed-list";
import { User } from "@prisma/client";
import { FC } from "react";

const aggregateFeeds = (data: InfiniteData<GetUserFeedResponse>) => {
  return data.pages.reduce((acc, page) => {
    return acc.concat(page.feed);
  }, [] as FeedVM[]);
};

const getNextCursor = (data: InfiniteData<GetUserFeedResponse>) => {
  return data?.pages[data?.pages.length - 1].nextCursor;
};

type UserFeedListContainerProps = {
  userId: User["id"];
};

export const UserFeedListContainer: FC<UserFeedListContainerProps> = ({ userId }) => {
  const { data, isLoading, isError, fetchNextPage, isFetchingNextPage } = api.feed.getUserFeed.useInfiniteQuery(
    {
      userId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (isLoading) {
    return <LoadingUserFeed />;
  }

  if (isError) {
    return <ErrorLoadingUserFeed />;
  }

  const feed = aggregateFeeds(data);
  const shouldLoadMore = Boolean(getNextCursor(data));

  return (
    <InfiniteUserFeedList
      feed={feed}
      loadMore={fetchNextPage}
      shouldLoadMore={shouldLoadMore}
      isFetching={isFetchingNextPage}
    />
  );
};
