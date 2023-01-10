import { Prisma } from "@prisma/client";
import { generateUserId } from "../../lib/user/utils/generateUserId";
import { generateSessionId } from "../../lib/session/utils/generateSessionId";
import { generateAccountId } from "../../lib/account/utils/generateAccountId";
import { generateUrlQueueId } from "../../lib/url-queue/utils/generateUrlQueueId";
import { generateUrlId } from "../../lib/url/utils/generateUrlId";
import { generateUserUrlId } from "../../lib/user-url/utils/generateUserUrlId";
import { generateUserProfileDataId } from "../../lib/user-profile-data/utils/generateUserProfileDataId";
import { generateFeedId } from "../../lib/feed/utils/generateFeedId";

export const ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR = "ID_PLACEHOLDER";

export const generateModelId: Prisma.Middleware = async (params: Prisma.MiddlewareParams, next) => {
  if (params.action === "upsert") {
    switch (params.model) {
      case "UserProfileData":
        params.args.create.id = generateUserProfileDataId();
        break;
    }
  }

  if (params.action === "create") {
    switch (params.model) {
      case "User":
        params.args.data.id = generateUserId();
        break;

      case "UserProfileData":
        params.args.data.id = generateUserProfileDataId();
        break;

      case "Session":
        params.args.data.id = generateSessionId();
        break;

      case "Account":
        params.args.data.id = generateAccountId();
        break;

      case "UrlQueue":
        params.args.data.id = generateUrlQueueId();
        break;

      case "Url":
        params.args.data.id = generateUrlId();
        break;

      case "UserUrl":
        params.args.data.id = generateUserUrlId();
        break;

      case "Feed":
        params.args.data.id = generateFeedId();
        break;
    }
  }

  return await next(params);
};
