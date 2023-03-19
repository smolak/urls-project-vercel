import { FC } from "react";
import { UserListItem } from "./UserListItem";
import { UserEntry } from "../../routers/user";

interface UserListProps {
  users: ReadonlyArray<UserEntry>;
}

export const UserList: FC<UserListProps> = ({ users }) => {
  return (
    <div className="bg-white sm:rounded-lg border border-gray-300 text-gray-900">
      <div className="bg-gray-100 sm:rounded-lg px-3 py-3 sm:grid sm:grid-cols-10 sm:gap-3 sm:px-6 font-bold">
        <span className="pl-12 col-span-3">Name</span>
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
