import { generateId } from "../../lib/shared/utils/generateId";
import { generateUserProfileDataId } from "../../lib/user-profile-data/utils/generateUserProfileDataId";
import { normalizeUsername } from "../../lib/user-profile-data/utils/normalizeUsername";
import { generateUserId } from "../../lib/user/utils/generateUserId";
import { UserProfileData } from "@prisma/client";

export const createUserProfileData = (overwrites: Partial<UserProfileData> = {}): UserProfileData => {
  const username = overwrites.username || "Jacek";

  return {
    id: generateUserProfileDataId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    apiKey: generateId(),
    username,
    usernameNormalized: normalizeUsername(username),
    userId: generateUserId(),
    following: 0,
    followers: 0,
    ...overwrites,
  };
};
