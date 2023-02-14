import { FC } from "react";
import { FeedVM } from "../../models/Feed.vm";
import { UserImage } from "../../../user/ui/UserImage";

export const UserFeedListItem: FC<FeedVM> = ({ user, url }) => {
  return (
    <div className="flex space-between space-x-4 rounded-md bg-white p-4 shadow-sm cursor-pointer hover:bg-slate-50">
      <div className="aspect-square w-8 object-cover">
        <UserImage {...user} />
      </div>
      <div className="w-[510px]">
        <h3 className="text-xl">
          <a href={url.url} title={url.metadata.title} className="font-bold block">
            {url.metadata.title || url.url}
          </a>
        </h3>
        <p className="text-xs mb-2">({url.url})</p>
        <img src={url.metadata.image} className="mb-2" />
        <p className="text-sm">{url.metadata.description}</p>
      </div>
    </div>
  );
};
