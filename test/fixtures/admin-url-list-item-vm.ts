import { generateUrlId } from "../../lib/url/utils/generate-url-id";
import { sha1 } from "../../lib/crypto/sha1";
import { generateUserUrlId } from "../../lib/user-url/utils/generate-user-url-id";
import { generateUserId } from "../../lib/user/utils/generate-user-id";
import { createExampleWebsiteMetadata } from "./example-metadata";
import { AdminUrlListItemVM } from "../../lib/admin/urls/models/admin-url-list-item.vm";
import { toPublicUserProfileDataVM } from "../../lib/user-profile-data/models/public-user-profile-data.vm";
import { createUserProfileData } from "./user-profile-data";

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
    userProfileData: toPublicUserProfileDataVM(createUserProfileData({ id: userId, ...overwrites.userProfileData })),
  };
};
