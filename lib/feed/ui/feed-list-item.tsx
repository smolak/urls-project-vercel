import { Url, UserProfileData, UserUrl } from "@prisma/client";
import { FC } from "react";
import { UserImage } from "../../user/ui/user-image";
import { Metadata } from "../../metadata/types";

interface UrlData extends Pick<Url, "id" | "url"> {
  metadata: Metadata;
}

export interface FeedListItem {
  id: UserUrl["id"];
  createdAt: string;
  userProfileData: Pick<UserProfileData, "username" | "image">;
  url: UrlData;
}

export const FeedListItem: FC<FeedListItem> = ({ id, createdAt, userProfileData: { username, image }, url }) => {
  return (
    <div className="space-between flex cursor-pointer space-x-4 rounded-md bg-white p-4 shadow-sm hover:bg-slate-50">
      <div className="aspect-square w-8 object-cover">
        <UserImage username={username} image={image} />
      </div>
      <div className="w-[510px]">
        <h3 className="text-xl">
          <a href={url.url} title={url.metadata.title} className="block font-bold">
            {url.metadata.title || url.url}
          </a>
        </h3>
        <p className="mb-2 text-xs">({url.url})</p>
        <img src={url.metadata.image} className="mb-2" />
        <p className="text-sm">{url.metadata.description}</p>
      </div>
    </div>
  );
};
