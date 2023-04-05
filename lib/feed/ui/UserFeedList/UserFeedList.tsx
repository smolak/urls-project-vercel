import { FC } from "react";
import { FeedVM } from "../../models/Feed.vm";
import { UserFeedListItem } from "./UserFeedListItem";

export interface UserFeedListProps {
  feed: ReadonlyArray<FeedVM>;
}

export const UserFeedList: FC<UserFeedListProps> = ({ feed }) => {
  return (
    <section className="mx-auto max-w-[700px]">
      <ol className="space-y-6">
        {feed.map((entry) => (
          <li key={entry.id}>
            <UserFeedListItem {...entry} />
          </li>
        ))}
      </ol>
    </section>
  );
};
