import { UserProfileData } from "@prisma/client";
import { generateUserProfileDataId } from "../../lib/user/utils/generateUserProfileDataId";
import { normalizeUsername } from "../../lib/user/utils/normalizeUsername";
import { generateUserId } from "../../lib/user/utils/generateUserId";
import { generateId } from "../../lib/shared/utils/generateId";

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
    ...overwrites,
  };
};
