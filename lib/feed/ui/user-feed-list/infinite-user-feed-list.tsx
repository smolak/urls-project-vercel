import { FC, useEffect, useRef } from "react";
import { FeedVM } from "../../models/feed.vm";
import { UserFeedList } from "./user-feed-list";
import { LoadingUserFeed } from "../loading-user-feed";

export interface InfiniteUserFeedListProps {
  feed: ReadonlyArray<FeedVM>;
  loadMore: () => void;
  shouldLoadMore?: boolean;
  isFetching?: boolean;
}

export const InfiniteUserFeedList: FC<InfiniteUserFeedListProps> = ({ feed, loadMore, isFetching, shouldLoadMore }) => {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && shouldLoadMore) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, loadMore, shouldLoadMore]);

  return (
    <>
      <UserFeedList feed={feed} />
      {isFetching && <LoadingUserFeed />}
      <div ref={observerTarget} />
    </>
  );
};
