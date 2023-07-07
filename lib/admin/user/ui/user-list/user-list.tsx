import { FC } from "react";
import { UserListItem } from "./user-list-item";
import { UserEntry } from "../../models/user-entry";

interface UserListProps {
  users: ReadonlyArray<UserEntry>;
}

export const UserList: FC<UserListProps> = ({ users }) => {
  return (
    <div className="border border-gray-300 bg-white text-gray-900 sm:rounded-lg">
      <div className="bg-gray-100 px-3 py-3 font-bold sm:grid sm:grid-cols-10 sm:gap-3 sm:rounded-lg sm:px-6">
        <span className="col-span-3 pl-12">Name</span>
        <span className="col-span-3">Email</span>
        <span>Role</span>
        <span className="col-span-2">Created at</span>
        <span>Options</span>
      </div>

      {users.map((user) => (
        <UserListItem {...user} key={user.id} />
      ))}
    </div>
  );
};
