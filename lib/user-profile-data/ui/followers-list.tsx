import { FC } from "react";
import { UserProfileData } from "@prisma/client";
import { ProfileListItem, ProfileListItemProps } from "./profile-list-item";

type FollowersListProps = {
  username: UserProfileData["username"];
  profiles: ReadonlyArray<ProfileListItemProps>;
  myProfile?: boolean;
};

export const FollowersList: FC<FollowersListProps> = ({ username, profiles, myProfile }) => {
  return (
    <section>
      <h1 className="mb-5 text-lg font-bold">
        {myProfile ? "Profiles following me" : `Profiles following ${username}`}
      </h1>
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
