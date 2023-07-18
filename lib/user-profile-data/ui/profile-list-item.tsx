import { UserImage } from "../../user/ui/user-image";
import Link from "next/link";
import { FollowsMeBadge } from "./follows-me-badge";
import { FollowingBadge } from "./following-badge";
import { Card } from "../../components/ui/card";
import { UserProfileData } from "@prisma/client";
import { YesNo } from "../../shared/types";
import { FC } from "react";

export type ProfileListItemProps = {
  username: UserProfileData["username"];
  image: UserProfileData["image"];
  iFollow?: YesNo;
  isFollowingMe?: YesNo;
};

export const ProfileListItem: FC<ProfileListItemProps> = ({ username, image, isFollowingMe, iFollow }) => {
  return (
    <Card className="flex items-center gap-4 p-2 hover:bg-slate-50">
      <UserImage username={username} image={image} />
      <Link href={`/${username}`} className="font-medium">
        @{username}
      </Link>
      {isFollowingMe === "yes" && <FollowsMeBadge />}
      {iFollow === "yes" && <FollowingBadge />}
    </Card>
  );
};
