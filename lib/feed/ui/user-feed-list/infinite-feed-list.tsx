import { FC, useEffect, useRef } from "react";
import { FeedVM } from "../../models/feed.vm";
import { FeedList } from "./feed-list";
import { LoadingFeed } from "../loading-feed";

export interface InfiniteFeedListProps {
  feed: ReadonlyArray<FeedVM>;
  loadMore: () => void;
  shouldLoadMore?: boolean;
  isFetching?: boolean;
}

export const InfiniteFeedList: FC<InfiniteFeedListProps> = ({ feed, loadMore, isFetching, shouldLoadMore }) => {
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
      <FeedList feed={feed} />
      {isFetching && <LoadingFeed />}
      <div ref={observerTarget} />
    </>
  );
};
