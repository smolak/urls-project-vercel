import { generateUrlId } from "../../lib/url/utils/generateUrlId";
import { sha1 } from "../../lib/crypto/sha1";
import { generateUserUrlId } from "../../lib/user-url/utils/generateUserUrlId";
import { generateUserId } from "../../lib/user/utils/generateUserId";
import { createExampleWebsiteMetadata } from "./exampleMetadata";
import { toPublicUserDataVM } from "../../lib/user/models/PublicUserData.vm";
import { createUser } from "./user";
import { AdminUrlListItemVM } from "../../lib/admin/urls/models/AdminUrlListItem.vm";

const url = "https://example.url";
const title = "Page title";
const description = "Description";

export const createAdminUrlListItemVM = (overwrites: Partial<AdminUrlListItemVM> = {}): AdminUrlListItemVM => {
  const userId = generateUserId();
  const urlId = generateUrlId();

  return {
    userUrl: {
      id: generateUserUrlId(),
      userId,
      urlId,
      createdAt: new Date(),
      ...overwrites.userUrl,
    },
    url: {
      id: urlId,
      createdAt: new Date(),
      updatedAt: new Date(),
      url,
      urlHash: sha1(url),
      title,
      description,
      metadata: createExampleWebsiteMetadata(),
      ...overwrites.url,
    },
    user: toPublicUserDataVM(createUser({ id: userId, ...overwrites.user })),
  };
};
