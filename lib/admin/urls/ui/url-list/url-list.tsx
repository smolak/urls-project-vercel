import { FC } from "react";
import { UrlListItem } from "./url-list-item";
import { AdminUrlListVM } from "../../models/admin-url-list.vm";

interface UrlListProps {
  urls: AdminUrlListVM;
}

export const UrlList: FC<UrlListProps> = ({ urls }) => {
  return (
    <div className="border border-gray-300 bg-white text-gray-900 sm:rounded-lg">
      <div className="bg-gray-100 px-3 py-3 font-bold sm:grid sm:grid-cols-10 sm:gap-3 sm:rounded-lg sm:px-6">
        <span className="col-span-3">URL</span>
        <span className="col-span-3">User</span>
        <span className="col-span-2">Created at</span>
        <span>Options</span>
      </div>

      {urls.map((url) => (
        <UrlListItem key={url.url.id} {...url} />
      ))}
    </div>
  );
};
