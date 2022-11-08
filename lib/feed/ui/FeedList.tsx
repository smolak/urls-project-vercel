import { FeedListItem } from "./FeedListItem";
import { FC } from "react";

export interface FeedListProps {
  items: ReadonlyArray<FeedListItem>;
}

export const FeedList: FC<FeedListProps> = ({ items }) => {
  return (
    <section className="mx-auto max-w-[600px]">
      <header className="my-5">
        <h2 className="mb-1 text-2xl font-bold">URL Feed</h2>
        <p>See what people recommend</p>
      </header>

      <ul className="space-y-2">
        {items.map((item) => {
          return (
            <li key={item.id}>
              <FeedListItem {...item} />
            </li>
          );
        })}
      </ul>
    </section>
  );
};
