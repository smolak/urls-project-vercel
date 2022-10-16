import { UserUrl } from "@prisma/client";
import { generateUserUrlId } from "../../lib/user-url/utils/generateUserUrlId";
import { generateUserId } from "../../lib/user/utils/generateUserId";
import { generateUrlId } from "../../lib/url/utils/generateUrlId";

export const createUserUrl = (overwrites: Partial<UserUrl> = {}): UserUrl => ({
  id: generateUserUrlId(),
  userId: generateUserId(),
  urlId: generateUrlId(),
  createdAt: new Date(),
  ...overwrites,
});
