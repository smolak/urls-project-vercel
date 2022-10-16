import { FC } from "react";
import { UrlListItem } from "./UrlListItem";
import { AdminUrlListVm } from "../../models/AdminUrlList.vm";

interface UrlListProps {
  urls: AdminUrlListVm;
}

export const UrlList: FC<UrlListProps> = ({ urls }) => {
  return (
    <div className="bg-white sm:rounded-lg border border-gray-300 text-gray-900">
      <div className="bg-gray-100 sm:rounded-lg px-3 py-3 sm:grid sm:grid-cols-10 sm:gap-3 sm:px-6 font-bold">
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
