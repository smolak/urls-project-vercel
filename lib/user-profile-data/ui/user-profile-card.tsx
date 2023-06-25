import { FC } from "react";
import { UserImage } from "../../user/ui/user-image";
import { ToggleFollowUser } from "../../follow-user/ui/toggle-follow-user";
import { PublicUserProfileDataVM } from "../models/public-user-profile-data.vm";

interface UserProfileCardProps {
  publicUserProfileData: PublicUserProfileDataVM;
  canFollow?: boolean;
}

export const UserProfileCard: FC<UserProfileCardProps> = ({ publicUserProfileData, canFollow = false }) => {
  const { id, username, image, following, followers } = publicUserProfileData;

  return (
    <div className="card card-compact drop-shadow bg-white sticky top-20 items-center gap-10 mt-20 p-3 pt-12">
      <UserImage username={username} image={image} size="big" className="absolute -top-9" />
      <div className="flex items-center gap-4">
        <p>@{username}</p>
        {canFollow && <ToggleFollowUser userId={id} />}
      </div>
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
    </div>
  );
};
