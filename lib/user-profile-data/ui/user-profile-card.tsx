import { FC } from "react";
import { UserImage } from "../../user/ui/user-image";
import { ToggleFollowUser } from "../../follow-user/ui/toggle-follow-user";
import { PublicUserProfileDataVM } from "../models/public-user-profile-data.vm";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

interface UserProfileCardProps {
  publicUserProfileData: PublicUserProfileDataVM;
  canFollow?: boolean;
}

export const UserProfileCard: FC<UserProfileCardProps> = ({ publicUserProfileData, canFollow = false }) => {
  const { id, username, image, following, followers } = publicUserProfileData;

  return (
    <Card className="bg-white sticky top-32">
      <CardHeader className="p-2">
        <CardTitle className="flex gap-3 justify-center pt-6">
          <UserImage username={username} image={image} size="big" className="absolute -top-9" />
          <span className="text-lg">@{username}</span>
          {canFollow && <ToggleFollowUser userId={id} />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 grid-rows-2 gap-x-16 gap-y-5 text-center text-sm">
          <div>
            <span className="font-extrabold">TBA</span>
            <br />
            <span className="text-xs text-gray-400">URLs</span>
          </div>
          <div>
            <span className="font-extrabold">TBA</span>
            <br />
            <span className="text-xs text-gray-400">Likes</span>
          </div>
          <div>
            <span className="font-bold">{following}</span>
            <br />
            <span className="text-xs text-gray-400">following</span>
          </div>
          <div>
            <span className="font-bold">{followers}</span>
            <br />
            <span className="text-xs text-gray-400">followers</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
