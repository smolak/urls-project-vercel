import { UserProfileData } from "@prisma/client";

export type PublicUserProfileDataVM = Pick<
  UserProfileData,
  "username" | "image" | "following" | "followers" | "likes"
> & {
  id: UserProfileData["userId"];
  createdAt: UserProfileData["createdAt"] | string;
};

export const toPublicUserProfileDataVM = ({
  username,
  image,
  following,
  followers,
  likes,
  createdAt,
  userId,
}: UserProfileData): PublicUserProfileDataVM => {
  return { username, image, following, followers, createdAt, id: userId, likes: Number(likes) };
};
