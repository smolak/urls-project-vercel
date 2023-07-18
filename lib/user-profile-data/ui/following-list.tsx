import { FC } from "react";
import { UserProfileData } from "@prisma/client";
import { ProfileListItem, ProfileListItemProps } from "./profile-list-item";

type FollowingFollowersListProps = {
  username: UserProfileData["username"];
  profiles: ReadonlyArray<ProfileListItemProps>;
  myProfile?: boolean;
};

export const FollowingList: FC<FollowingFollowersListProps> = ({ username, profiles, myProfile }) => {
  return (
    <section>
      <h1 className="mb-5 text-lg font-bold">{myProfile ? "Profiles I follow" : `Profiles ${username} follows`}</h1>
      <ol className="flex flex-col gap-1.5">
        {profiles.map((profile) => {
          return (
            <li key={profile.username}>
              <ProfileListItem {...profile} />
            </li>
          );
        })}
      </ol>
    </section>
  );
};
