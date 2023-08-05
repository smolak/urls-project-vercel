import { FC } from "react";
import { FeedVM } from "../../models/feed.vm";
import { UserFeedListItem } from "./user-feed-list-item";
import { useSession } from "next-auth/react";
import { useToast } from "../../../components/ui/use-toast";
import { ToastAction } from "../../../components/ui/toast";
import Link from "next/link";
import { NotLikedIcon, ToggleLikeUrl } from "./toggle-like-url";

export interface UserFeedListProps {
  feed: ReadonlyArray<FeedVM>;
}

export const UserFeedList: FC<UserFeedListProps> = ({ feed }) => {
  const { status } = useSession();
  const canLikeUrl = status === "authenticated";
  const { toast } = useToast();
  const showCantLikeWithoutLoginMessage = () => {
    toast({
      title: "Want to like this URL?",
      description: "💡 You need to be logged in first.",
      action: (
        <Link href="/auth/login">
          <ToastAction altText="Login">Login</ToastAction>
        </Link>
      ),
    });
  };

  return (
    <section>
      <ol className="flex flex-col gap-4">
        {feed.map((entry) => (
          <li key={entry.id}>
            <UserFeedListItem
              {...entry}
              interactions={
                <>
                  {canLikeUrl ? (
                    <ToggleLikeUrl feedId={entry.id} liked={entry.url.liked} likes={entry.url.likes} />
                  ) : (
                    <button
                      className="flex items-center gap-1.5 rounded-xl p-2 text-sm hover:bg-red-50"
                      onClick={showCantLikeWithoutLoginMessage}
                    >
                      <NotLikedIcon />
                      {entry.url.likes}
                    </button>
                  )}
                </>
              }
            />
          </li>
        ))}
      </ol>
    </section>
  );
};
