import { FC } from "react";
import { LoadingUsers } from "./LoadingUsers";
import { ErrorLoadingUsers } from "./ErrorLoadingUsers";
import { UserList } from "./UserList";
import { api } from "../../../../../utils/api";

export const UserListConnected: FC = () => {
  const { isLoading, isError, data, error } = api.user.getUsers.useQuery();

  if (isLoading) {
    return <LoadingUsers />;
  }

  if (isError) {
    return <ErrorLoadingUsers error={error} />;
  }

  return <UserList users={data} />;
};
