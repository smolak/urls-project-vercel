import { FC } from "react";
import { format } from "date-fns";
import { UserListOptions } from "./user-list-options";
import { UserImage } from "../user-image";
import { UserEntry } from "../../models/user-entry";

export const UserListItem: FC<UserEntry> = ({ id, email, role, name, image, createdAt }) => {
  return (
    <div className="border-t border-gray-200 px-3 py-3 text-sm sm:grid sm:grid-cols-10 sm:gap-3 sm:px-6">
      <div className="col-span-3 flex items-center">
        <UserImage name={name || ""} image={image} />
        <span className="ml-4">
          {name}
          <br />
          <span className="text-xs text-gray-400">{id}</span>
        </span>
      </div>
      <span className="col-span-3 flex items-center">{email}</span>
      <span className="flex items-center">{role}</span>
      <span className="col-span-2 flex items-center">{format(new Date(createdAt), "yyyy-MM-dd'T'HH:mm:ss")}</span>
      <span className="flex items-center">
        <div className="w-56 text-right">
          <UserListOptions />
        </div>
      </span>
    </div>
  );
};
