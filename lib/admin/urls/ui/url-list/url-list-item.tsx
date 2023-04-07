import { FC } from "react";
import { UrlListItemOptions } from "./url-list-item-options";
import { UserImage } from "../../../user/ui/user-image";
import { AdminUrlListItemVM } from "../../models/admin-url-list-item.vm";
import { formatDate } from "../../../../shared/utils/format-date";

export const UrlListItem: FC<AdminUrlListItemVM> = ({ url, user, userUrl }) => {
  return (
    <div className="border-t border-gray-200 px-3 py-3 sm:grid sm:grid-cols-10 sm:gap-3 sm:px-6 text-sm">
      <span className="flex items-center col-span-3">{url.url}</span>
      <div className="flex items-center col-span-3">
        <UserImage name={user.name || ""} image={user.image} />
        <span className="ml-4">
          {user.name}
          <br />
          <span className="text-xs text-gray-400">{user.id}</span>
        </span>
      </div>

      <span className="flex items-center col-span-2">{formatDate(userUrl.createdAt)}</span>
      <span className="flex items-center">
        <div className="w-56 text-right">
          <UrlListItemOptions />
        </div>
      </span>
    </div>
  );
};
