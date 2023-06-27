import { FC } from "react";
import { FeedVM } from "../../models/feed.vm";
import { UserFeedListItem } from "./user-feed-list-item";

export interface UserFeedListProps {
  feed: ReadonlyArray<FeedVM>;
}

export const UserFeedList: FC<UserFeedListProps> = ({ feed }) => {
  return (
    <section>
      <ol className="flex flex-col gap-4">
        {feed.map((entry) => (
          <li key={entry.id}>
            <UserFeedListItem {...entry} />
          </li>
        ))}
      </ol>
    </section>
  );
};
