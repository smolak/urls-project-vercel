import { FC } from "react";
import { UrlListItemOptions } from "./url-list-item-options";
import { UserImage } from "../../../user/ui/user-image";
import { AdminUrlListItemVM } from "../../models/admin-url-list-item.vm";
import { formatDate } from "../../../../shared/utils/format-date";

export const UrlListItem: FC<AdminUrlListItemVM> = ({ url, userProfileData, userUrl }) => {
  const { username, image, id } = userProfileData;

  return (
    <div className="border-t border-gray-200 px-3 py-3 text-sm sm:grid sm:grid-cols-10 sm:gap-3 sm:px-6">
      <span className="col-span-3 flex items-center">{url.url}</span>
      <div className="col-span-3 flex items-center">
        <UserImage name={username} image={image} />
        <span className="ml-4">
          {username}
          <br />
          <span className="text-xs text-gray-400">{id}</span>
        </span>
      </div>

      <span className="col-span-2 flex items-center">{formatDate(userUrl.createdAt)}</span>
      <span className="flex items-center">
        <div className="w-56 text-right">
          <UrlListItemOptions />
        </div>
      </span>
    </div>
  );
};
