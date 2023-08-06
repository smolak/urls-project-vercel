import { LoadingUserFeed } from "../loading-user-feed";
import { ErrorLoadingUserFeed } from "../error-loading-user-feed";
import { api } from "../../../../utils/api";
import { InfiniteData } from "@tanstack/react-query";
import { GetUserFeedResponse } from "../../router/procedures/get-user-feed";
import { FeedVM } from "../../models/feed.vm";
import { InfiniteUserFeedList } from "./infinite-user-feed-list";
import { FC } from "react";
import { User } from "@prisma/client";

const aggregateFeeds = (data: InfiniteData<GetUserFeedResponse>) => {
  return data.pages.reduce((acc, page) => {
    return acc.concat(page.feed);
  }, [] as FeedVM[]);
};

const getNextCursor = (data: InfiniteData<GetUserFeedResponse>) => {
  return data?.pages[data?.pages.length - 1].nextCursor;
};

type InfiniteUserFeedListFromProps = {
  from: FeedVM["createdAt"];
  userId: User["id"];
};

export const InfiniteUserFeedListFrom: FC<InfiniteUserFeedListFromProps> = ({ from, userId }) => {
  const { data, isLoading, isError, fetchNextPage, isFetchingNextPage } = api.feed.getUserFeed.useInfiniteQuery(
    {
      userId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: new Date(from),
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
