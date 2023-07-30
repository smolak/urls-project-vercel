import { FC } from "react";
import { ToggleFollowUser } from "../../follow-user/ui/toggle-follow-user";
import { PublicUserProfileDataVM } from "../models/public-user-profile-data.vm";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { UserImage } from "../../user/ui/user-image";
import Link from "next/link";
import { RssIcon } from "lucide-react";

interface UserProfileCardProps {
  publicUserProfileData: PublicUserProfileDataVM;
  canFollow?: boolean;
}

export const UserProfileCard: FC<UserProfileCardProps> = ({ publicUserProfileData, canFollow = false }) => {
  const { id, username, image, following, followers, likes } = publicUserProfileData;

  return (
    <Card className="sticky top-32 bg-white">
      <CardHeader className="mb-2 p-2">
        <CardTitle className="flex justify-center gap-3 pt-7">
          <UserImage username={username} image={image} size="big" className="absolute -top-9 hover:ring-0" />
          <div className="flex flex-col items-center gap-2">
            <span className="text-lg">@{username}</span>
            {canFollow && <ToggleFollowUser userId={id} />}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-2 grid-rows-2 gap-x-14 gap-y-4 text-center text-sm">
          <Link href={`/${username}`}>
            <div className="rounded p-1 hover:bg-slate-100">
              <span className="font-extrabold">TBA</span>
              <br />
              <span className="text-xs text-gray-400">URLs</span>
            </div>
          </Link>
          <div>
            <span className="font-extrabold">{likes}</span>
            <br />
            <span className="text-xs text-gray-400">Likes</span>
          </div>
          <Link href={`/${username}/following`}>
            <div className="rounded p-1 hover:bg-slate-100">
              <span className="font-bold">{following}</span>
              <br />
              <span className="text-xs text-gray-400">following</span>
            </div>
          </Link>
          <Link href={`/${username}/followers`}>
            <div className="rounded p-1 hover:bg-slate-100">
              <span className="font-bold">{followers}</span>
              <br />
              <span className="text-xs text-gray-400">followers</span>
            </div>
          </Link>
        </div>
        <div className="flex place-content-center">
          <Link href={`${username}/rss.xml`}>
            <RssIcon size={16} />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
