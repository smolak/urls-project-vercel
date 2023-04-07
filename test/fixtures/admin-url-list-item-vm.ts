import { generateUrlId } from "../../lib/url/utils/generate-url-id";
import { sha1 } from "../../lib/crypto/sha1";
import { generateUserUrlId } from "../../lib/user-url/utils/generate-user-url-id";
import { generateUserId } from "../../lib/user/utils/generate-user-id";
import { createExampleWebsiteMetadata } from "./example-metadata";
import { toPublicUserDataVM } from "../../lib/user/models/public-user-data.vm";
import { createUser } from "./user";
import { AdminUrlListItemVM } from "../../lib/admin/urls/models/admin-url-list-item.vm";

const url = "https://example.url";

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
      metadata: createExampleWebsiteMetadata(),
      ...overwrites.url,
    },
    user: toPublicUserDataVM(createUser({ id: userId, ...overwrites.user })),
  };
};
