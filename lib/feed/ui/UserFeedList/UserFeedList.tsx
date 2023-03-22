import { FC } from "react";
import { FeedVM } from "../../models/Feed.vm";
import { UserFeedListItem } from "./UserFeedListItem";

export interface UserFeedListProps {
  feeds: ReadonlyArray<FeedVM>;
}

export const UserFeedList: FC<UserFeedListProps> = ({ feeds }) => {
  return (
    <section className="mx-auto max-w-[700px]">
      <ol className="space-y-6">
        {feeds.map((feed) => (
          <li key={feed.id}>
            <UserFeedListItem {...feed} />
          </li>
        ))}
      </ol>
    </section>
  );
};
