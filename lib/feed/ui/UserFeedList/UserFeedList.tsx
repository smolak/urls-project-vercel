import { FC } from "react";
import { FeedVM } from "../../models/Feed.vm";
import { UserFeedListItem } from "./UserFeedListItem";

export interface UserFeedListProps {
  feeds: ReadonlyArray<FeedVM>;
}

export const UserFeedList: FC<UserFeedListProps> = ({ feeds }) => {
  return (
    <section className="mx-auto max-w-[600px]">
      <header className="my-5">
        <h2 className="mb-1 text-2xl font-bold">URL Feed</h2>
        <p>See what people recommend</p>
      </header>

      <ol className="space-y-2">
        {feeds.map((feed) => (
          <li key={feed.id}>
            <UserFeedListItem {...feed} />
          </li>
        ))}
      </ol>
    </section>
  );
};
