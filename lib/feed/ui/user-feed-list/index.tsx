import { UserFeedListContainer } from "./user-feed-list.container";
import { User } from "@prisma/client";
import { FC } from "react";

type UserFeedListProps = {
  userId: User["id"];
};

export const UserFeedList: FC<UserFeedListProps> = ({ userId }) => <UserFeedListContainer userId={userId} />;
