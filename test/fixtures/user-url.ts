import { UserUrl } from "@prisma/client";
import { generateUserUrlId } from "../../lib/user-url/utils/generate-user-url-id";
import { generateUserId } from "../../lib/user/utils/generate-user-id";
import { generateUrlId } from "../../lib/url/utils/generate-url-id";

export const createUserUrl = (overwrites: Partial<UserUrl> = {}): UserUrl => ({
  id: generateUserUrlId(),
  userId: generateUserId(),
  urlId: generateUrlId(),
  createdAt: new Date(),
  ...overwrites,
});
