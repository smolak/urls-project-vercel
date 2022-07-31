import { FC } from "react";
import { format } from "date-fns";
import { UserListOptions } from "./UserListOptions";
import { User } from "next-auth";
import { UserImage } from "../UserImage";

export const UserListItem: FC<User> = ({ id, email, role, name, image, createdAt }) => {
  return (
    <div key={id} className="border-t border-gray-200 px-3 py-3 sm:grid sm:grid-cols-10 sm:gap-3 sm:px-6 text-sm">
      <div className="flex items-center col-span-3">
        <UserImage name={name || ""} image={image} />
        <span className="ml-4">{name}</span>
      </div>
      <span className="flex items-center col-span-3">{email}</span>
      <span className="flex items-center">{role}</span>
      <span className="flex items-center col-span-2">{format(new Date(createdAt), "yyyy-MM-dd'T'HH:mm:ss")}</span>
      <span className="flex items-center">
        <UserListOptions />
      </span>
    </div>
  );
};