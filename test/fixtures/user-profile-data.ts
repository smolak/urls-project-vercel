import { generateId } from "../../lib/shared/utils/generate-id";
import { generateUserProfileDataId } from "../../lib/user-profile-data/utils/generate-user-profile-data-id";
import { normalizeUsername } from "../../lib/user-profile-data/utils/normalize-username";
import { generateUserId } from "../../lib/user/utils/generate-user-id";
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