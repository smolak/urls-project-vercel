import { FC } from "react";
import { FeedVM } from "../../models/Feed.vm";
import { UserImage } from "../../../user/ui/UserImage";
import Link from "next/link";
import { formatDate } from "../../../shared/utils/formatDate";

export const UserFeedListItem: FC<FeedVM> = ({ user, url, createdAt }) => {
  return (
    <div className="card card-compact bg-base-200 shadow-xl">
      {url.metadata.image && (
        <figure>
          <a href={url.url} title={url.metadata.title} target="_blank">
            <img src={url.metadata.image} alt={url.metadata.title} />
          </a>
        </figure>
      )}
      <div className="card-body">
        <h2 className="card-title">
          <a href={url.url} title={url.metadata.title} target="_blank" className="font-bold block">
            {url.metadata.title || url.url}
          </a>
        </h2>
        <p className="text-sm">{url.metadata.description}</p>
        <div className="card-actions justify-end items-center">
          {formatDate(createdAt)}
          <Link href={`/${user.username}`}>
            <UserImage {...user} />
          </Link>
        </div>
      </div>
    </div>
  );
};
