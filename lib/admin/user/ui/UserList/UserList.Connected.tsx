import { FC } from "react";
import { useUsersQuery } from "../hooks/useUsersQuery";
import { LoadingUsers } from "./LoadingUsers";
import { ErrorLoadingUsers } from "./ErrorLoadingUsers";
import { UserList } from "./UserList";

export const UserListConnected: FC = () => {
  const { isLoading, isError, data, error } = useUsersQuery();

  if (isLoading) {
    return <LoadingUsers />;
  }

  if (isError) {
    return <ErrorLoadingUsers error={error} />;
  }

  return <UserList users={data} />;
};
